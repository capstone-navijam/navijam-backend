import {
    Injectable,
} from "@nestjs/common";
import {
    Member, PrismaClient,
} from "@prisma/client";
import {
    CreateChatRoomRequestDto,
} from "@main/chatroom/dto/req/create-chat-room.request.dto";
import {
    CreateChatRoomResponseDto,
} from "@main/chatroom/dto/res/create-chat-room.response.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";
import {
    IsNotListenerException,
} from "@main/exception/is-not-listener.exception";
import {
    GetAllMemberChatroomsResponseDto,
} from "@main/chatroom/dto/res/get-all-member-chatrooms.response.dto";
import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    GetAllListenerChatroomsResponseDto,
} from "@main/chatroom/dto/res/get-all-listener-chatrooms.response.dto";
import {
    GetChatroomDetailResponseDto,
} from "@main/chatroom/dto/res/get-chat-room-detail.response.dto";

@Injectable()
export class ChatroomService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 채팅방 생성
    async createChatroom(body: CreateChatRoomRequestDto, member: Member): Promise<CreateChatRoomResponseDto> {
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

        return new CreateChatRoomResponseDto(chatRoom.id.toString());
    }

    // (회원)모든 채팅방 목록 조회
    async getAllMemberChatRooms(memberId: bigint): Promise<GetAllMemberChatroomsResponseDto[]> {
        const chatRooms = await this.prisma.chatRoom.findMany({
            where: {
                memberId,
            },
            include: {
                listener: {
                    include: {
                        Member: {
                            select: {
                                nickname: true,
                                profile: true,
                            },
                        },
                    },
                },
                chats: {
                    select: {
                        message: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc", // 최근 메시지가 첫 번째로 오도록 정렬
                    },
                },
            },
            orderBy: {
                recentMessageTime: "desc", // 전체 채팅방을 최근 메시지 시간으로 정렬
            },
        });

        return chatRooms.map(chatroom => {
            const listenerMember = chatroom.listener?.Member;

            // 최근 메시지 시간 계산
            const recentMessageTime = chatroom.recentMessageTime
                || chatroom.chats[0]?.createdAt // chats 배열에서 가장 최근 메시지 시간 사용
                || new Date(); // 모든 값이 없을 경우 현재 시간 사용

            // 최근 메시지 내용
            const recentMessage = chatroom.recentMessage
                || chatroom.chats[0]?.message // chats 배열에서 최근 메시지 내용 사용
                || "최근 메시지가 없습니다.";

            return new GetAllMemberChatroomsResponseDto(
                chatroom.id.toString(), listenerMember?.nickname || "알 수 없음", listenerMember?.profile || "", recentMessage, getTimestamp(recentMessageTime, undefined, "datetime"), chatroom.isEnabled,
            );
        });
    }

    // 단일 채팅방 조회 API
    async getChatroomById(roomId: bigint): Promise<GetChatroomDetailResponseDto> {
        const chatroom = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId, 
            },
            include: {
                member: {
                    select: {
                        nickname: true,
                        profile: true,
                    },
                },
                listener: {
                    include: {
                        Member: {
                            select: {
                                nickname: true,
                                profile: true,
                            },
                        },
                    },
                },
                chats: {
                    select: {
                        message: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc", 
                    },
                },
            },
        });

        if (!chatroom) throw new Error("Chatroom not found");

        const lastChat = chatroom.chats[0] || {
            message: "대화 없음",
            createdAt: new Date(), 
        };

        return new GetChatroomDetailResponseDto(
            chatroom.id.toString(), chatroom.listener?.Member?.nickname || "", chatroom.listener?.Member?.profile || "", lastChat.message, getTimestamp(lastChat.createdAt, undefined, "datetime"), chatroom.isEnabled,
        );
    }
}