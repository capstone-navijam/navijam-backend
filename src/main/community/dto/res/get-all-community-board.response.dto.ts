import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetAllCommunityBoardResponseDto {
    @ApiProperty({
        type: String,
        description: "Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "작성자 프로필",
        example: "http://profile.com/profile1.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        type: String,
        description: "닉네임",
        example: "example",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "카테고리",
        example: [Category.FREE,
            Category.BREAKUP,],
        required: true,
        enum: Category,
        isArray: true,
    })
    readonly categories: Category[];

    @ApiProperty({
        type: String,
        description: "커뮤니티 제목",
        example: "조언 부탁드립니다.",
    })
    readonly title: string;

    @ApiProperty({
        type: String,
        description: "커뮤니티 내용",
        example: "조언 부탁드립니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: String,
        description: "작성 또는 수정된 시간",
        example: "2024. 10. 03. 오후 06:56:15",
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
        timestamp: string,
        memberId: string
    ) {
        this.id = id;
        this.profile = profile;
        this.nickname = nickname;
        this.categories = categories;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
        this.memberId = memberId;
    }
}