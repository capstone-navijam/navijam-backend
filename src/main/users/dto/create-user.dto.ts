import {
    IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsUrl, IsEmail,
} from "class-validator";

export class CreateUserDto {
    // email
    @IsEmail({}, {
        message: "이메일 주소 형식을 지켜주세요.",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly email: string;

    // nickname
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(8)
    @Matches(/^[a-zA-Z0-9가-힣]*$/, {
        message: "닉네임은 2~8글자의 한글 또는 영문자, 숫자여야 합니다.",
    })
    readonly nickname: string;

    // password
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {
        message: "비밀번호는 8~14글자의 영문, 숫자, 특수문자를 포함해야 합니다.",
    })
    readonly password: string;

    // profile
    @IsUrl()
    @MaxLength(100)
    readonly profile: string;

    // address
    @IsString()
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9가-힣\s]*$/, {
        message: "주소는 한글, 영문, 숫자, 공백만 허용됩니다.",
    })
    readonly address: string;

    // name
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(5)
    @Matches(/^[가-힣]*$/, {
        message: "이름은 2~5글자의 한글만 허용됩니다.",
    })
    readonly name: string;

    // career
    @IsString()
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9가-힣\s]*$/, {
        message: "경력은 한글, 영문, 숫자, 공백만 허용됩니다.",
    })
    readonly career: string;

    // description
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @Matches(/^[a-zA-Z0-9가-힣\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/, {
        message: "설명은 한글, 영문, 숫자, 특수문자, 공백만 허용됩니다.",
    })
    readonly description: string;

    // phoneNumber
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{3}-\d{4}-\d{4}$/, {
        message: "휴대폰 번호는 3-4-4 형식이어야 합니다. (ex: 010-1234-5678)",
    })
    readonly phone_number: string;
};