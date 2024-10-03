import {
    ApiProperty,
} from "@nestjs/swagger";

export class WriteCommentResponseDto {
    @ApiProperty({
        description: "Comment Id",
        type: String,
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}