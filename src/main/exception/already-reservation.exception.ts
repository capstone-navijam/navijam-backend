import {
    BadRequestException,
} from "@nestjs/common";

export class AlreadyReservationException extends BadRequestException {
    constructor() {
        super({
            message: "이미 예약된 상담사입니다.",
        });
    }
}