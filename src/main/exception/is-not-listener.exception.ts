import {
    BadRequestException,
} from "@nestjs/common";

export class IsNotListenerException extends BadRequestException {
    constructor() {
        super({
            message: "해당 회원 정보는 상담사가 아닌 일반 회원입니다. 상담사 정보를 전달해주세요.",
        });
    }
}