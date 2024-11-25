import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateChatroomResponseDto {
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