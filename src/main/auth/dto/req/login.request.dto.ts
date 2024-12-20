import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsEmail, IsString, Matches,
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
    readonly email: string;

    @ApiProperty({
        description: "비밀번호",
        example: "test1234@",
        required: true,
    })
    @IsString()
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {})
    readonly password: string;
}