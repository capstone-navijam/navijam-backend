import {
    Socket,
} from "socket.io";

export class ChatMember extends Socket {
    memberId: string;
}