import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Role, 
} from "@prisma/client";

export class LoginResponseDto {
    @ApiProperty({
        description: "닉네임",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "역할",
    })
    readonly role: Role;

    @ApiProperty({
        description: "프로필",
    })
    readonly profile: string;

    @ApiProperty({
        description: "액세스 토큰",
    })
    accessToken: string;

    @ApiProperty({
        description: "토큰 타입",
    })
    tokenType: string = "Bearer";
}