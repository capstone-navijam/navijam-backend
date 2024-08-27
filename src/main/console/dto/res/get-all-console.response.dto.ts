import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Transform,
} from "class-transformer";

export class GetAllConsoleResponseDto {
    @ApiProperty({
        type: String,
        description: "Console Id",
        example: "1",
    })
    @Transform(({
        value,
    }) => value.toString())

    readonly id: string;

    @ApiProperty({
        type: String,
        description: "이름",
        example: "상담사",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "프로필",
        example: "http://",
    })
    readonly profile: string;

    @ApiProperty({
        type: String,
        description: "위로받기 게시글 답글(위로하기)",
        example: "충분히 공감하는 사연입니다.",
    })
    readonly content: string;

    @ApiProperty({
        type: Date,
        description: "답글 작성 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly createdAt: Date;

    @ApiProperty({
        type: Date,
        description: "답글 수정 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly updatedAt: Date;

    constructor(id: string, nickname: string, profile: string, content: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
