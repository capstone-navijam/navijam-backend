import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetComfortBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Board id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "게시글 제목",
        example: "조언 부탁드립니다.",
    })
    readonly title: string;

    @ApiProperty({
        type: String,
        description: "게시글 내용",
        example: "요즘 너무 지치는 일들이 많아 스트레스입니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
        description: "게시글 작성 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly createdAt: Date;

    constructor(id: string, title: string, content: string, createdAt: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }
}