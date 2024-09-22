import {
    NotFoundException,
} from "@nestjs/common";

export default class NotFoundListenerException extends NotFoundException {
    constructor() {
        super({
            message: "존재하지 않는 상담사입니다.",
        });
    }
}