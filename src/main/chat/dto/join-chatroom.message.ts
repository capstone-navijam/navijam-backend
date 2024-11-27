import {
    IsNumber,
} from "class-validator";

export class JoinChatRoomMessage {
    @IsNumber()
    roomId: bigint;
}