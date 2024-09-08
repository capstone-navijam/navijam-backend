import {
    NotFoundException,
} from "@nestjs/common";

export default class NotFoundMemberException extends NotFoundException {
    constructor() {
        super({
            message: "존재하지 않는 회원입니다.",
        });
    }
}