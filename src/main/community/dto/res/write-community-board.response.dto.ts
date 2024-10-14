import {
    ApiProperty,
} from "@nestjs/swagger";

export class WriteCommunityBoardResponseDto {
    @ApiProperty({
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
