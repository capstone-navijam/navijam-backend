import {
    ForbiddenException,
    Injectable, UnauthorizedException,
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
import {
    NotFoundChatroomException,
} from "@main/exception/websocket/not-found-chatroom.exception";
import {
    ChatroomAlreadyClosedException,
} from "@main/exception/http/chatroom-already-closed.exception";
import {
    ActiveChatroomDeletionException,
} from "@main/exception/http/active-chatroom-deletion.exception";

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

    // (회원) 모든 채팅방 목록 조회
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
                        createdAt: "desc",
                    },
                },
            },
            orderBy: {
                recentMessageTime: "desc",
            },
        });

        return chatRooms.map(chatroom => {
            const listenerMember = chatroom.listener?.Member;

            // 최근 메시지 시간 계산
            const recentMessageTime = chatroom.recentMessageTime
                || chatroom.chats[0]?.createdAt
                || new Date();

            // 최근 메시지 내용
            const recentMessage = chatroom.recentMessage
                || chatroom.chats[0]?.message
                || "최근 메시지가 없습니다.";

            return new GetAllMemberChatroomsResponseDto(
                chatroom.id.toString(), listenerMember?.nickname || "알 수 없음", listenerMember?.profile || "", recentMessage, getTimestamp(recentMessageTime, undefined, "datetime"), chatroom.isEnabled,
            );
        });
    }

    // (상담사) 모든 채팅방 목록 조회
    async getAllListenerChatRooms(listenerId: bigint): Promise<GetAllListenerChatroomsResponseDto[]> {
        const chatRooms = await this.prisma.chatRoom.findMany({
            where: {
                listenerId,
            },
            include: {
                member: {
                    select: {
                        nickname: true,
                        profile: true,
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
            orderBy: {
                recentMessageTime: "desc",
            },
        });

        return chatRooms.map(chatroom => {
            const member = chatroom.member;

            const recentMessageTime = chatroom.recentMessageTime
                || chatroom.chats[0]?.createdAt
                || new Date();

            const recentMessage = chatroom.recentMessage
                || chatroom.chats[0]?.message
                || "최근 메세지가 없습니다.";

            return new GetAllListenerChatroomsResponseDto(
                chatroom.id.toString(), member?.nickname || "", member?.profile || "", recentMessage, getTimestamp(recentMessageTime, undefined, "datetime"), chatroom.isEnabled,
            );
        });

    }

    // 채팅방 상세 조회
    async getChatroomDetail(roomId: bigint, memberId: bigint): Promise<GetChatroomDetailResponseDto> {
        const chatroom = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },
            select: {
                id: true,
                memberId: true,
                listenerId: true,
                isEnabled: true,
                recentMessageTime: true,
                member: {
                    select: {
                        nickname: true,
                        profile: true,
                    },
                },
                listener: {
                    select: {
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
                        id: true,
                        message: true,
                        createdAt: true,
                        memberId: true,
                        member: {
                            select: {
                                id: true,
                                nickname: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!chatroom) throw new NotFoundChatroomException;

        if (!chatroom.isEnabled) {
            throw new ChatroomAlreadyClosedException();
        }

        const participant = chatroom.memberId === memberId
            ? chatroom.listener?.Member
            : chatroom.member;

        const messages = chatroom.chats.map(chat => ({
            id: chat.id.toString(),
            senderId: chat.member.id.toString(),
            senderNickname: chat.member.nickname,
            message: chat.message,
            createdAt: getTimestamp(chat.createdAt, undefined, "datetime"),
        }));

        const timestamp = getTimestamp(chatroom.recentMessageTime || new Date(0), undefined, "datetime");

        return new GetChatroomDetailResponseDto(
            chatroom.id, participant?.nickname || "알 수 없음", participant?.profile || "", messages, chatroom.isEnabled, timestamp,
        );
    }

    // 채팅방 종료
    async endChatRoom(roomId: bigint): Promise<void> {
        const chatroom = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },

        });

        if (!chatroom) {
            throw new NotFoundChatroomException();
        }

        if (!chatroom.isEnabled) {
            throw new ChatroomAlreadyClosedException();
        }

        await this.prisma.chatRoom.update({
            where: {
                id: roomId,
            },
            data: {
                isEnabled: false,
            },
        });
    }

    // 채팅방 삭제
    async deleteChatRoom(roomId: bigint, memberId: bigint): Promise<void> {
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },
            include: {
                member: true,
                listener: {
                    include: {
                        Member: true,
                    },
                },
            },
        });

        // 1. 채팅방 존재 여부 확인
        if (!chatRoom) {
            throw new NotFoundChatroomException;
        }

        // 2. 채팅방 활성화 여부 확인
        if (chatRoom.isEnabled) {
            throw new ActiveChatroomDeletionException;
        }

        // 3. 사용자권한 확인
        const isMemberAuthorized =
            chatRoom.memberId === memberId ||
            chatRoom.listener?.Member?.id === memberId;

        if (!isMemberAuthorized) {
            throw new ForbiddenException("권한이 존재하지 않습니다.");
        }

        // 4. 채팅방 및 관련 데이터 삭제
        await this.prisma.$transaction(async (prisma) => {
            await prisma.chat.deleteMany({
                where: {
                    roomId,
                },
            });

            await prisma.chatRoom.delete({
                where: {
                    id: roomId,
                },
            });
        });
    }
}