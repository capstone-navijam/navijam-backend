import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateReservationResponseDto {
    @ApiProperty({
        description: "Chatroom Id",
        type: String,
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}