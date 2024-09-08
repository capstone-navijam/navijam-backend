import {
    ConflictException,
} from "@nestjs/common";

export class ExistAdoptedConsoleException extends ConflictException {
    constructor() {
        super({
            message: "채택된 답변이 존재합니다.",
        });
    }
}