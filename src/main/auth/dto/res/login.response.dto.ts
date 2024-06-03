import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Role, 
} from "@prisma/client";
import {
    IsEnum,
    IsString, IsUrl, MaxLength,
} from "class-validator";

export class LoginResponseDto {
    @ApiProperty({
        description: "닉네임",
    })
    @IsString()
    readonly nickname: string;

    @ApiProperty({
        description: "역할",
    })
    @IsEnum(Role)
    readonly role: Role;

    @ApiProperty({
        description: "프로필",
    })
    @IsUrl({}, {})
    @MaxLength(100)
    readonly profile: string;

    @ApiProperty({
        description: "액세스 토큰",
    })
    @IsString()
    accessToken: string;

    @ApiProperty({
        description: "토큰 타입",
    })
    @IsString()
    tokenType: string = "Bearer";
}