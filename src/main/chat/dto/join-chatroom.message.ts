import {
    IsNotEmpty,
} from "class-validator";

export class JoinChatRoomMessage {
    @IsNotEmpty()
    roomId: string;
}