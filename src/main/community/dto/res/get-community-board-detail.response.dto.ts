import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetCommunityBoardDetailResponseDto {
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
        description: "카테고리",
        enum: Category,
        isArray: true,
        example: ["자유",],
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
        example: "요즘 너무 지치는 일들이 많아 스트레스입니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
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

    @ApiProperty({
        description: "좋아요 상태",
        example: true,
    })
    readonly liked: boolean;

    @ApiProperty({
        description: "현재 좋아요 수",
        example: 15,
    })
    readonly likeCount: number;

    @ApiProperty({
        description: "댓글 개수",
        example: 2,
    })
    readonly commentCount: number;

    constructor(
        id: string,
        profile: string,
        nickname: string,
        categories: Category[],
        title: string,
        content: string,
        memberId: string,
        timestamp: string,
        liked: boolean,
        likeCount: number,
        commentCount: number,
    ) {
        this.id = id;
        this.profile = profile;
        this.nickname = nickname;
        this.categories = categories;
        this.title = title;
        this.content = content;
        this.memberId = memberId;
        this.timestamp = timestamp;
        this.liked = liked;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
    }
}