import {
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import {
    NotFoundChatroomException,
} from "@main/exception/websocket/not-found-chatroom.exception";
import {
    SendChatMessage,
} from "@main/chat/dto/send-chat.message";
import {
    NotFoundMemberException,
} from "@main/exception/websocket/not-found-member.exception";
import {
    InvalidSendChatException,
} from "@main/exception/websocket/invalid-send-chat.exception";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaClient) {
    }

    async validateChatroomId(id: bigint, memberId: string): Promise<void> {
        await this.prisma.$transaction(async tx => {
            const existsMember = await tx.member.findUnique({
                where: {
                    id: BigInt(memberId),
                },
                include: {
                    listenerInfo: true,
                },
            });

            if (!existsMember) {
                throw new NotFoundMemberException();
            }

            const chatroom = await tx.chatRoom.findUnique({
                where: {
                    id: id,
                },
            });

            if (!chatroom) {
                throw new NotFoundChatroomException();
            }

            if (chatroom.memberId !== existsMember.id
                && (existsMember.listenerInfo && chatroom.listenerId !== existsMember.listenerInfo.id)) {
                throw new InvalidSendChatException();
            }
        });
    }

    async saveChat(message: SendChatMessage, id: string) {
        return await this.prisma.$transaction(async tx => {
            const existsMember = await tx.member.findUnique({
                where: {
                    id: BigInt(id),
                },
                include: {
                    listenerInfo: true,
                },
            });

            if (!existsMember) {
                throw new NotFoundMemberException();
            }

            const existsChatroom = await tx.chatRoom.findUnique({
                where: {
                    id: BigInt(message.roomId),
                },
            });

            if (!existsChatroom) {
                throw new NotFoundChatroomException();
            }

            if (existsChatroom.memberId !== existsMember.id
                && (existsMember.listenerInfo && existsChatroom.listenerId !== existsMember.listenerInfo.id)) {
                throw new InvalidSendChatException();
            }

            const chat = await tx.chat.create({
                data: {
                    message: message.message,
                    memberId: existsMember.id,
                    roomId: BigInt(message.roomId),
                },
            });

            await tx.chatRoom.update({
                where: {
                    id: BigInt(message.roomId),
                },
                data: {
                    recentMessageTime: new Date(),
                    recentMessage: message.message,
                },
            });

            return chat.id;
        });
    }

    /**
     * 사용자 ID를 기반으로 상담사 여부 확인
     */
    async isListener(memberId: bigint): Promise<boolean> {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
            select: {
                role: true,
            },
        });

        if (!member) {
            throw new NotFoundMemberException;
        }

        return member.role === "LISTENER";
    }
}