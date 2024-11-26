import {
    WsException,
} from "@nestjs/websockets";

export class NotFoundException extends WsException {
    constructor(message: string) {
        super({
            message,
        });
    }
}