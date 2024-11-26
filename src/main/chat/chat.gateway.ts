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

    constructor(private readonly chatService: ChatService) {
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