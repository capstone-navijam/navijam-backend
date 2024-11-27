import {
    IsNotEmpty, IsNumber,
} from "class-validator";

export class SendChatMessage {
    @IsNumber()
    roomId: bigint;

    @IsNotEmpty()
    message: string;
}