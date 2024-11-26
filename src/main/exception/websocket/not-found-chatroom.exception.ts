import {
    NotFoundException,
} from "@main/exception/websocket/common/not-found.exception";

export class NotFoundChatroomException extends NotFoundException {
    constructor() {
        super("해당 채팅방을 찾지 못했습니다.");
    }
}