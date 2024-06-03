import {
    ConflictException,
} from "@nestjs/common";

export class DuplicateEmailException extends ConflictException {
    constructor() {
        super({
            message: "이메일이 중복되었습니다.",
        });
    }
}