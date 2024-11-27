import {
    IsNotEmpty,
} from "class-validator";

export class SendChatMessage {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    message: string;
}