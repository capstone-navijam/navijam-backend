import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetWaitingComfortBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "위로받기 게시글 주제",
        example: ["자유",],
        required: true,
        enum: Category,
        isArray: true,
    })
    readonly categories: Category[];

    @ApiProperty({
        type: String,
        description: "게시글 제목",
        example: "조언 부탁드립니다.",
    })
    readonly title: string;

    @ApiProperty({
        description: "작성 또는 수정 시간",
        example: "2024-08-31T12:34:56.789Z (수정)",
    })
    readonly timestamp: string;

    constructor(id: string, categories: Category[], title: string, timestamp: string) {
        this.id = id;
        this.categories = categories;
        this.title = title;
        this.timestamp = timestamp;
    }
}