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
    ChatroomService,
} from "@main/chatroom/chatroom.service";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";

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

    constructor(private readonly chatService: ChatService,
                private readonly chatroomService: ChatroomService,) {
    }

    @SubscribeMessage("join")
    async join(@MessageBody() message: JoinChatRoomMessage, @ConnectedSocket() client: ChatMember) {
        await this.chatService.validateChatroomId(message.roomId, client.memberId);

        client.join(message.roomId.toString());
        this.server.to(message.roomId.toString()).emit("joinSuccess", {
            message: `${client.memberId} joined!`,
        });
    }

    @SubscribeMessage("message")
    async message(@MessageBody() message: SendChatMessage, @ConnectedSocket() client: ChatMember) {
        await this.chatService.saveChat(message, client.memberId);

        this.server.to(message.roomId.toString()).emit("message", {
            sender: client.memberId,
            message: message.message,
        });
        await this.emitChatroomUpdate(message.roomId);
    }

    private async emitChatroomUpdate(roomId: bigint) {
        // **채팅방 데이터를 최신 상태로 조회**
        const chatroomData = await this.chatroomService.getChatroomById(roomId);

        // 해당 채팅방을 조회 중인 사용자들에게 실시간으로 업데이트
        this.server.to(roomId.toString()).emit("updateChatroomList", chatroomData);
    }

    @SubscribeMessage("getChatroomDetail")
    async handleGetChatroomDetail(
        @MessageBody("roomId", ParseBigIntPipe) roomId: bigint,
        @ConnectedSocket() client: ChatMember,
    ) {
        const chatroom = await this.chatroomService.getChatroomById(roomId);

        client.emit("chatroomDetail", chatroom);
    }

    @SubscribeMessage("updateChatrooms")
    async updateChatRooms(
        @ConnectedSocket() client: ChatMember,
    ) {
        const listenerId = BigInt(client.memberId);
        const chatRooms = await this.chatroomService.getAllListenerChatRooms(listenerId);

        client.emit("updateChatRooms", chatRooms);
    }

    afterInit(server: Server) {
        console.log("init chat");
    }

    handleDisconnect(client: Socket): any {
        console.log("disconnect");
    }

    handleConnection(client: Socket, ...args: any[]): any {
        console.log("connect");
    }

}