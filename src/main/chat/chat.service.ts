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
        const existsMember = await this.prisma.member.findUnique({
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

        const chatroom = await this.prisma.chatRoom.findUnique({
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
    }

    async saveChat(message: SendChatMessage, id: string) {
        const existsMember = await this.prisma.member.findUnique({
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

        const existsChatroom = await this.prisma.chatRoom.findUnique({
            where: {
                id: message.roomId,
            },
        });

        if (!existsChatroom) {
            throw new NotFoundChatroomException();
        }

        if (existsChatroom.memberId !== existsMember.id
            && (existsMember.listenerInfo && existsChatroom.listenerId !== existsMember.listenerInfo.id)) {
            throw new InvalidSendChatException();
        }

        const chat = await this.prisma.chat.create({
            data: {
                message: message.message,
                memberId: existsMember.id,
                roomId: message.roomId,
            },
        });

        return chat.id;
    }
}