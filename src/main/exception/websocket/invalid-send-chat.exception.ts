import {
    BadRequestException,
} from "@main/exception/websocket/common/bad-request.exception";

export class InvalidSendChatException extends BadRequestException {
    constructor() {
        super("잘못된 채팅 메시지 전달 요청입니다.");
    }
}