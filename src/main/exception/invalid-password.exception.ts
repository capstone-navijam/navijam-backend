import {
    BadRequestException,
} from "@nestjs/common";

export class InvalidPasswordException extends BadRequestException {
    constructor() {
        super({
            message: "비밀번호가 틀립니다.",
        });
    }
}