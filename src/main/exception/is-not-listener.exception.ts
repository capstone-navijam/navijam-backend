import {
    BadRequestException,
} from "@nestjs/common";

export class IsNotListenerException extends BadRequestException {
    constructor() {
        super({
            message: "상담은 상담사와 진행할 수 있기 때문에 채팅방 생성이 불가능합니다.",
        });
    }
}