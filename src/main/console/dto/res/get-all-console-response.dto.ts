import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetAllConsoleResponseDto {
    @ApiProperty({
        description: "Console Id",
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
        description: "위로하기 내용",
        example: "매우 공감되는 사연입니다.",
    })
    readonly content: string;

    @ApiProperty({
        description: "작성 또는 수정 시간",
        example: "2024-08-31T12:34:56.789Z (수정)",
    })
    readonly timestamp: string;

    @ApiProperty({
        type: String,
        description: "Member Id",
        example: "1",
    })
    readonly memberId: string;

    constructor(id: string, nickname: string, profile: string, content: string, timestamp: string, memberId: string) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.content = content;
        this.timestamp = timestamp;
        this.memberId = memberId;
    }
}
