import {
    IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsUrl, IsEmail,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignupRequestDto {
    @ApiProperty({
        description: "이메일",
    })
    @IsEmail({}, {
        message: "이메일 주소 형식을 지켜주세요.",
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @MaxLength(50, {
        message: "이메일은 50자 이하여야 합니다.",
    })
    readonly email: string;

    @ApiProperty({
        description: "닉네임",
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @MinLength(2, {
        message: "닉네임은 최소 2글자 이상이어야 합니다.",
    })
    @MaxLength(8, {
        message: "닉네임은 최대 8글자까지 허용됩니다.",
    })
    @Matches(/^[a-zA-Z0-9가-힣]*$/, {
        message: "닉네임은 2~8글자의 한글 또는 영문자, 숫자여야 합니다.",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "비밀번호",
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @MinLength(8, {
        message: "비밀번호는 최소 8글자 이상이어야 합니다.",
    })
    @MaxLength(14, {
        message: "비밀번호는 최대 14글자까지 허용됩니다.",
    })
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {
        message: "비밀번호는 8~14글자의 영문, 숫자, 특수문자를 포함해야 합니다.",
    })
    readonly password: string;

    @ApiProperty({
        description: "비밀번호 확인",
    })
    readonly checkPassword: string;

    @ApiProperty({
        description: "프로필",
    })
    @IsUrl({}, {
        message: "프로필 사진이 형식에 맞지 않습니다.",
    })
    @MaxLength(100)
    readonly profile: string;
}