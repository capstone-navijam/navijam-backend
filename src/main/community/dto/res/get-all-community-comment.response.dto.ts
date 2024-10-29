import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetAllCommunityCommentResponseDto {
    @ApiProperty({
        description: "Comment Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "이름",
        example: "난이춘식",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "프로필",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "댓글 내용",
        example: "저도 그 부분은 되게 공감하는 부분이에요",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
        description: "작성 시간",
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
        type: String,
        description: "Community Id",
        example: "1",
    })
    readonly communityId: string;

    constructor(id: string, nickname: string, profile: string, content: string, timestamp: string, memberId: string, communityId: string) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.content = content;
        this.timestamp = timestamp;
        this.memberId = memberId;
        this.communityId = communityId;
    }
}
