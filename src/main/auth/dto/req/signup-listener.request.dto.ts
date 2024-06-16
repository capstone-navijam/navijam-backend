import {
    ArrayMaxSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class SignupListenerRequestDto {
    // 이메일
    @ApiProperty({
        description: "이메일",
        required: true,
    })
    @IsEmail({}, {
        message: "이메일 주소 형식을 지켜주세요.",
    })
    readonly email: string;

    // 이름
    @ApiProperty({
        description: "이름",
        required: true,
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @Matches(/^[a-zA-Z0-9가-힣]{2,8}$/, {
        message: "이름은 2~8글자의 한글 또는 영문자이어야 합니다.",
    })
    readonly nickname: string;

    // 비밀번호
    @ApiProperty({
        description: "비밀번호",
        required: true,
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {
        message: "비밀번호는 8~14글자의 영문, 숫자, 특수문자를 포함해야 합니다.",
    })
    readonly password: string;

    // 비밀번호 확인
    @ApiProperty({
        description: "비밀번호 확인",
        required: true,
    })
    readonly checkPassword: string;

    // 프로필
    @ApiProperty({
        description: "프로필",
        required: true,
    })
    @IsUrl({}, {
        message: "프로필 사진이 형식에 맞지 않습니다.",
    })
    @MaxLength(100)
    readonly profile: string;

    // 주소
    @IsOptional()
    @ApiProperty({
        description: "주소",
    })
    @MaxLength(50, {
        message: "주소는 최대 50글자까지 입력할 수 있습니다.",
    })
    @Matches(/^[\s\w\d가-힣]*$/, {
        message: "주소는 한글, 영문, 숫자, 공백만 허용됩니다.",
    })
    address?: string;

    // 경력
    @ApiProperty({
        description: "경력",
        required: true,
    })
    @IsArray()
    @ArrayMaxSize(20, {
        message: "경력은 최대 20개까지 입력할 수 있습니다.",
    })
    @Matches(/^[\s\w\d가-힣]{1,30}$/, {
        each: true,
        message: "경력은 한글, 영문, 숫자, 공백만 허용되며, 최대 30글자까지 입력할 수 있습니다.",
    })
    career: string[];

    // 한 줄 소개
    @ApiProperty({
        description: "한 줄 소개",
        required: true,
    })
    @Matches(/^[\s\w\d가-힣!@#$%^&*()-=_+{}\[\]:;"'<>,.?\\/]{3,100}$/, {
        message: "한 줄 소개는 3글자 이상, 100글자 이하의 한글, 영문, 숫자, 특수문자, 공백으로 입력해주세요.",
    })
    description: string;

    // 전화번호
    @ApiProperty({
        description: "전화번호",
    })
    @IsOptional()
    @Matches(/^\d{3}-\d{4}-\d{4}$/, {
        message: "전화번호는 '010-1234-5678' 형식으로 입력해주세요.",
    })
    phoneNumber?: string;

    // 카테고리
    @ApiProperty({
        description: "카테고리",
        required: true,
        enum: Category,
    })
    category: Category[];
}
