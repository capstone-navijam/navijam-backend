import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetComfortBoardDetailResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "작성자 프로필",
        example: "https://example.com",
    })
    readonly profile: string;

    @ApiProperty({
        type: String,
        description: "닉네임",
        example: "example",
    })
    readonly nickname: string;

    @ApiProperty({
        enum: Category,
        description: "카테고리",
        isArray: true,
        example: ["자유",],
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
        example: "요즘 너무 지치는 일들이 많아 스트레스입니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
        description: "작성 또는 수정된 시간",
        example: "2024-07-29T20:30:55.150Z",
    })
    readonly timestamp: string;

    @ApiProperty({
        type: String,
        description: "Member Id",
        example: "1",
    })
    readonly memberId: string;

    constructor(
        id: string,
        profile: string,
        nickname: string,
        categories: Category[],
        title: string,
        content: string,
        memberId: string,
        timestamp: string,
    ) {
        this.id = id;
        this.profile = profile;
        this.nickname = nickname;
        this.categories = categories;
        this.title = title;
        this.content = content;
        this.memberId = memberId;
        this.timestamp = timestamp;
    }
}