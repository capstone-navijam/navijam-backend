import {
    ApiProperty,
} from "@nestjs/swagger";

export class WriteCommunityCommentResponseDto {
    @ApiProperty({
        description: "Comment Id",
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
