import {
    IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsUrl, IsEmail,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateMemberDto {
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
        description: "프로필",
    })
    @IsUrl({})
    @MaxLength(100, {
        message: "url 형식을 지켜주세요.",
    })
    readonly profile: string;

    // @ApiProperty({
    //     description: "주소",
    // })
    // @IsString({})
    // @MaxLength(50, {
    //     message: "주소는 50자 이하여야 합니다.",
    // })
    // @Matches(/^[a-zA-Z0-9가-힣\s]*$/, {
    //     message: "주소는 한글, 영문, 숫자, 공백만 허용됩니다.",
    // })
    // readonly address: string;
    //
    // @ApiProperty({
    //     description: "이름",
    // })
    // @IsString({})
    // @IsNotEmpty({
    //     message: "공백을 포함할 수 없습니다.",
    // })
    // @MinLength(2, {
    //     message: "이름은 최소 2글자 이상이어야 합니다.",
    // })
    // @MaxLength(5, {
    //     message: "이름은 최대 5글자까지 허용됩니다.",
    // })
    // @Matches(/^[가-힣]*$/, {
    //     message: "이름은 2~5글자의 한글만 허용됩니다.",
    // })
    // readonly name: string;
    //
    // @ApiProperty({
    //     description: "경력",
    // })
    // @IsString({})
    // @MaxLength(50, {
    //     message: "경력은 50자 이하여야 합니다.",
    // })
    // @Matches(/^[a-zA-Z0-9가-힣\s]*$/, {
    //     message: "경력은 한글, 영문, 숫자, 공백만 허용됩니다.",
    // })
    // readonly career: string;
    //
    // @ApiProperty({
    //     description: "한 줄 소개",
    // })
    // @IsString({})
    // @MinLength(3, {
    //     message: "한 줄 소개는 최소 3글자 이상이어야 합니다.",
    // })
    // @MaxLength(100, {
    //     message: "한 줄 소개는 최대 100글자까지 허용됩니다.",
    // })
    // @Matches(/^[a-zA-Z0-9가-힣\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/, {
    //     message: "한 줄 소개는 한글, 영문, 숫자, 특수문자, 공백만 허용됩니다.",
    // })
    // readonly description: string;
    //
    // @ApiProperty({
    //     description: "전화번호",
    // })
    // @IsString({})
    // @IsNotEmpty({
    //     message: "공백을 포함할 수 없습니다.",
    // })
    // @Matches(/^\d{3}-\d{4}-\d{4}$/, {
    //     message: "휴대폰 번호는 3-4-4 형식이어야 합니다. (ex: 010-1234-5678)",
    // })
    // readonly phoneNumber: string;
}