import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateComfortBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Update Board Id",
        example: "1",
    })

    readonly id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}