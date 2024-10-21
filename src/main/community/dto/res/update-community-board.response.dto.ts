import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateCommunityBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}