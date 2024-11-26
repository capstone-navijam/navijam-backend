import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetAnsweredComfortBoardResponseDto {
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
        type: Date,
        description: "게시글 작성 시간",
    })
    readonly timestamp: string;

    constructor(id: string, categories: Category[],  title: string, timestamp: string) {
        this.id = id;
        this.categories = categories;
        this.title = title;
        this.timestamp = timestamp;
    }
}