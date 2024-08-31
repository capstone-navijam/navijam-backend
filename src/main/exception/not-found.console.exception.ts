import {
    NotFoundException,
} from "@nestjs/common";

export default class NotFoundConsoleException extends NotFoundException {
    constructor() {
        super({
            message: "답변을 찾을 수 없습니다.",
        });
    }
}