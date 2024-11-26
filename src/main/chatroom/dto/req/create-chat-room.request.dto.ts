import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty,
} from "class-validator";

export class CreateChatRoomRequestDto {
    @ApiProperty({
        description: "Listener Id",
        type: Number,
        required: true,
        example: "1",
    })
    @IsNotEmpty({
        message: "상담하고자 하는 상담사 정보는 필수입니다.",
    })
    listenerId: number;

}