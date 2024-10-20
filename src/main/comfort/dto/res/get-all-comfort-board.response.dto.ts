import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetAllComfortBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "위로받기 게시글 주제",
        example: [Category.FREE,
            Category.BREAKUP,],
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
        type: String,
        description: "게시글 내용",
        example: "조언 부탁드립니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: String,
        description: "Writer Id",
        example: "1",
    })
    readonly writerId: string;

    @ApiProperty({
        type: String,
        description: "작성자 프로필 URL",
        example: "http://profile.com/profile1.jpg",
    })
    readonly writerProfile: string;

    @ApiProperty({
        type: String,
        description: "작성자 닉네임",
        example: "choonsik",
    })
    readonly writerNickname: string;

    @ApiProperty({
        type: String,
        description: "게시글 작성 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly createdAt: string;

    @ApiProperty({
        type: Boolean,
        description: "답변 여부",
        example: true,
    })
    readonly isAnswered: boolean;

    constructor(
        id: string,
        categories: Category[],
        title: string,
        content: string,
        writerId: string,
        writerProfile: string,
        writerNickname: string,
        createdAt: string,
        isAnswered: boolean
    ) {
        this.id = id;
        this.categories = categories;
        this.title = title;
        this.content = content;
        this.writerId = writerId;
        this.writerProfile = writerProfile;
        this.writerNickname = writerNickname;
        this.createdAt = createdAt;
        this.isAnswered = isAnswered;
    }
}