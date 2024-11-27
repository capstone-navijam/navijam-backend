import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty,
} from "class-validator";

export class CreateReservationRequestDto {
    @ApiProperty({
        description: "Listener Id",
        type: Number,
        required: true,
        example: "1",
    })
    @IsNotEmpty({
        message: "예약을 위해 상담사 정보는 필수입니다.",
    })
    listenerId: number;
}