import {
    HttpException, HttpStatus,
} from "@nestjs/common";

export class ChatroomAlreadyClosedException extends HttpException {
    constructor() {
        super("이미 채팅방이 닫혀있습니다.", HttpStatus.BAD_REQUEST);
    }
}