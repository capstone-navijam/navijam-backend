import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import {
    Server, Socket,
} from "socket.io";
import {
    ChatService,
} from "@main/chat/chat.service";
import {
    ChatroomService,
} from "@main/chatroom/chatroom.service";
import {
    UseFilters,
    UseGuards, UsePipes,
} from "@nestjs/common";
import {
    WebSocketValidationPipe,
} from "@main/chat/pipe/websocket-validation.pipe";
import {
    JoinChatRoomMessage,
} from "@main/chat/dto/join-chatroom.message";
import {
    SendChatMessage,
} from "@main/chat/dto/send-chat.message";
import {
    ChatMember,
} from "@main/chat/chat.member";
import {
    WebSocketJwtGuard,
} from "@main/chat/guard/websocket-jwt.guard";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";
import {
    WsExceptionFilter,
} from "@main/filter/ws-exception.filter";
import {
    ChatroomAlreadyClosedException,
} from "@main/exception/http/chatroom-already-closed.exception";

@UseFilters(WsExceptionFilter)
@UseGuards(WebSocketJwtGuard)
@UsePipes(WebSocketValidationPipe)
@WebSocketGateway(3030, {
    namespace: "chat",
    cors: {
        origin: "*",
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly chatroomService: ChatroomService,
    ) {
    }

    /**
     * 채팅방 참여
     */
    @SubscribeMessage("joinChatRoom")
    async joinChatRoom(
        @MessageBody() message: JoinChatRoomMessage,
        @ConnectedSocket() client: ChatMember,
    ) {
        await this.chatService.validateChatroomId(BigInt(message.roomId), client.memberId);

        client.join(message.roomId);
        this.server.to(message.roomId).emit("userJoined", {
            message: `${client.memberId} joined the room.`,
        });
    }

    /**
     * 채팅 메시지 전송
     */
    @SubscribeMessage("sendMessage")
    async handleSendMessage(
        @MessageBody() message: SendChatMessage,
        @ConnectedSocket() client: ChatMember,
    ) {
        try {
            const memberId = BigInt(client.memberId);
            const chatroom = await this.chatroomService.getChatroomDetail(BigInt(message.roomId), memberId);

            // 채팅방 활성 상태 검증
            if (!chatroom.isEnabled) {
                throw new ChatroomAlreadyClosedException();
            }

            // 메시지 저장 로직
            await this.chatService.saveChat(message, client.memberId);

            // 실시간 메시지 이벤트
            this.server.to(message.roomId.toString()).emit("newMessage", {
                sender: client.memberId,
                message: message.message,
                timestamp: new Date().toISOString(),
            });

            // 채팅방 상태 업데이트
            await this.updateChatRoom(BigInt(message.roomId), memberId);
        } catch (error) {
            if (error instanceof ChatroomAlreadyClosedException) {
                client.emit("error", {
                    message: error.message,
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 채팅방 상태 업데이트
     */
    private async updateChatRoom(roomId: bigint, memberId: bigint) {
        const chatroomData = await this.chatroomService.getChatroomDetail(roomId, memberId);

        this.server.to(roomId.toString()).emit("updateChatRoom", chatroomData);
    }

    /**
     * 특정 채팅방 상세 조회
     */
    @SubscribeMessage("getChatRoomDetail")
    async handleGetChatRoomDetail(
        @MessageBody("roomId", ParseBigIntPipe) roomId: string,
        @ConnectedSocket() client: ChatMember,
    ) {
        const memberId = BigInt(client.memberId);
        const chatroom = await this.chatroomService.getChatroomDetail(BigInt(roomId), memberId);

        client.emit("chatRoomDetail", chatroom);
    }

    /**
     * 전체 채팅방 목록 조회
     */
    @SubscribeMessage("getChatRooms")
    async handleGetChatRooms(@ConnectedSocket() client: ChatMember) {
        const memberId = BigInt(client.memberId);

        // 사용자 기준으로 채팅방 목록 가져오기 (회원/상담사 구분)
        const isListener = await this.chatService.isListener(memberId);
        const chatRooms = isListener
            ? await this.chatroomService.getAllListenerChatRooms(memberId)
            : await this.chatroomService.getAllMemberChatRooms(memberId);

        client.emit("chatRooms", chatRooms);
    }

    /**
     * 채팅방 종료
     */
    @SubscribeMessage("endChatRoom")
    async handleEndChatRoom(
        @MessageBody("roomId", ParseBigIntPipe) roomId: bigint,
        @ConnectedSocket() client: ChatMember,
    ) {
        try {
            // 채팅방 종료 서비스 호출
            await this.chatroomService.endChatRoom(roomId);

            // WebSocket으로 상담 종료 상태 알림
            this.server.to(roomId.toString()).emit("endChatRoom", {
                message: "채팅방 연결이 해제되었습니다.",
                roomId: roomId.toString(),
            });

            // 채팅방 연결 해제
            this.server.socketsLeave(roomId.toString());
        } catch (error) {
            if (error instanceof ChatroomAlreadyClosedException) {
                client.emit("endChatRoom", {
                    message: error.message,
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * WebSocket 초기화 이벤트
     */
    afterInit(server: Server) {
        console.log("WebSocket initialized.");
    }

    /**
     * WebSocket 연결 이벤트
     */
    handleConnection(client: Socket): void {
        console.log(`Client connected: ${client.id}`);
    }

    /**
     * WebSocket 연결 종료 이벤트
     */
    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
    }
}
