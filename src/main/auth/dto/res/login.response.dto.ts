import {
    ApiProperty,
} from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({
        type: String,
        description: "닉네임",
        example: "test123",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "역할",
        example: "MEMBER",
    })
    readonly role: string;

    @ApiProperty({
        type: String,
        description: "프로필 URL",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        type: String,
        description: "액세스 토큰",
    })
    readonly accessToken: string;

    @ApiProperty({
        type: String,
        description: "토큰 타입",
        example: "Bearer",
    })
    readonly tokenType: string;

    constructor(nickname: string, role: string, profile: string, accessToken: string, tokenType: string) {
        this.nickname = nickname;
        this.role = role;
        this.profile = profile;
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }
}