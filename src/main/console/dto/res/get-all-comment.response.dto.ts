import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetAllCommentResponseDto {
    @ApiProperty({
        description: "Comment Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "이름",
        example: "상담사",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "프로필",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "댓글 내용",
        example: "더 자세한 상담을 원하신다면, 개인 상담을 요청해주세요.",
    })
    readonly content: string;

    @ApiProperty({
        description: "작성시간",
        example: "2024-08-31T12:34:56.789Z",
    })
    readonly timestamp: string;

    @ApiProperty({
        type: String,
        description: "Member Id",
        example: "1",
    })
    readonly memberId: string;

    @ApiProperty({
        type: String,
        description: "Console Id",
        example: "1",
    })
    readonly consoleId: string;

    constructor(id: string, nickname: string, profile: string, content: string, timestamp: string, memberId: string, consoleId: string) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.content = content;
        this.timestamp = timestamp;
        this.memberId = memberId;
        this.consoleId = consoleId;
    }
}
