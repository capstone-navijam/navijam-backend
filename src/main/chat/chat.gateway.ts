import {
    WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";
import {
    Server,
} from "socket.io";

@WebSocketGateway()
export class ChatGateway {
    @WebSocketServer()
    private readonly server: Server;
}