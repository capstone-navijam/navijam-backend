import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetComfortBoardWithStatusResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
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
        description: "게시글 작성 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly createdAt: string;

    @ApiProperty({
        description: "답변 여부",
        example: true,
    })
    readonly isAnswered: boolean;

    constructor(id: string, title: string, createdAt: string, isAnswered: boolean) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.isAnswered = isAnswered;
    }
}