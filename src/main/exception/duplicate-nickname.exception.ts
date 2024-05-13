import {
    ConflictException,
} from "@nestjs/common";

export class DuplicateNicknameException extends ConflictException {
    constructor() {
        super({
            message: "닉네임이 중복되었습니다.",
        });
    }
}