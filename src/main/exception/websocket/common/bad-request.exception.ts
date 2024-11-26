import {
    WsException,
} from "@nestjs/websockets";

export class BadRequestException extends WsException {
    constructor(message: string) {
        super({
            message,
        });
    }
}