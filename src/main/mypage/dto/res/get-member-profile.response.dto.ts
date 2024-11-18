import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetMemberProfileResponseDto {
    @ApiProperty({
        description: "멤버 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "프로필 URL",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "이메일 주소",
        example: "example@example.com",
    })
    readonly email: string;

    @ApiProperty({
        description: "닉네임",
        example: "난이춘식",
    })
    readonly nickname: string;

    constructor(id: string, profile: string, email: string, nickname: string) {
        this.id = id;
        this.profile = profile;
        this.email = email;
        this.nickname = nickname;
    }
}