import {
    WsException,
} from "@nestjs/websockets";

export class UnauthorizedException extends WsException {
    constructor(message: string) {
        super({
            message,
        });
    }
}