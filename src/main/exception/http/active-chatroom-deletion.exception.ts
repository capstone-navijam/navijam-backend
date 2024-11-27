import {
    HttpException, HttpStatus,
} from "@nestjs/common";

export class ActiveChatroomDeletionException extends HttpException {
    constructor() {
        super("활성화된 채팅방은 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }
}