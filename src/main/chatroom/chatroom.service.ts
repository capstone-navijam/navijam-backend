import {
    Injectable,
} from "@nestjs/common";
import {
    Member, PrismaClient,
} from "@prisma/client";
import {
    CreateChatRoomRequestDto,
} from "@main/chatroom/dto/req/create-chatroom.request.dto";
import {
    CreateChatroomResponseDto,
} from "@main/chatroom/dto/res/create-chatroom.response.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";
import {
    IsNotListenerException,
} from "@main/exception/is-not-listener.exception";
import {
    GetActiveChatroomsResponseDto,
} from "@main/chatroom/dto/res/get-active-chatrooms.response.dto";

@Injectable()
export class ChatroomService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 채팅방 생성
    async createChatroom(body: CreateChatRoomRequestDto, member: Member): Promise<CreateChatroomResponseDto> {
        const listener = await this.prisma.member.findUnique({
            where: {
                id: body.listenerId,
            },
            include: {
                listenerInfo: true,
            },
        });

        if (!listener) {
            throw new NotFoundListenerException();
        }

        if (!listener.listenerInfo) {
            throw new IsNotListenerException();
        }

        const chatRoom = await this.prisma.chatRoom.create({
            data: {
                memberId: member.id,
                listenerId: listener.listenerInfo!.id,
            },
        });

        return new CreateChatroomResponseDto(chatRoom.id.toString());
    }

    // 채팅방 목록 조회 API
    async getActiveChatrooms(memberId: bigint): Promise<GetActiveChatroomsResponseDto[]> {
        const chatrooms = await this.prisma.chatRoom.findMany({
            where: {
                memberId: memberId,
                isEnabled: true,
            },
            include: {
                listener: {
                    include: {
                        Member: true,
                    },
                },
                chats: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
        });

        return chatrooms.map((chatroom) => {
            const recentMessage = chatroom.chats[0]?.message || "메시지가 없습니다.";
            const recentMessageTime = chatroom.chats[0]?.createdAt?.toISOString() || "";

            return new GetActiveChatroomsResponseDto(
                chatroom.id, chatroom.listener.Member?.profile || "", chatroom.listener.Member?.nickname || "", recentMessage, recentMessageTime,
            );
        });
    }
}