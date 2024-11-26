import {
    NotFoundException,
} from "@main/exception/websocket/common/not-found.exception";

export class NotFoundMemberException extends NotFoundException {
    constructor() {
        super("회원을 찾을 수 없습니다.");
    }
}