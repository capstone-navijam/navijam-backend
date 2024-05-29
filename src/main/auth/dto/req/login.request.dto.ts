import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsEmail,
    IsString, Matches, MaxLength, MinLength,
} from "class-validator";

export class LoginRequestDto {
    @ApiProperty({
        description: "이메일",
        example: "test@testing.com",
        required: true,
    })
    @IsString()
    @IsEmail({}, {
        message: "이메일 형식을 입력해주세요.",
    })
    email: string;

    @ApiProperty({
        description: "비밀번호",
        example: "test1234@",
        required: true,
    })
    @IsString()
    @MinLength(8, {})
    @MaxLength(14, {})
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {})
    password: string;
}