import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetMyCommunityCommentsResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "댓글 내용",
        example: "저도 그 부분은 되게 공감하는 부분이에요",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
        description: "작성 또는 수정된 시간",
        example: "2024. 10. 03. 오후 06:56:15",
    })
    readonly timestamp: string;

    constructor(
        id: string,
        content: string,
        timestamp: string,
    ) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
    }
}