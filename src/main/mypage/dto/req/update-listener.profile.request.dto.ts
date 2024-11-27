import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    ArrayMaxSize, IsArray, IsOptional, IsString, Matches, MaxLength, MinLength,
} from "class-validator";
import {
    Category,
} from "@main/global/category";

export class UpdateListenerProfileRequestDto {
    @ApiProperty({
        description: "이름",
        required: false,
    })
    @IsString()
    @Matches(/^[a-zA-Z0-9가-힣]{2,8}$/, {
        message: "이름은 2~8글자의 한글 또는 영문자이어야 합니다.",
    })
    readonly nickname: string;

    @IsOptional()
    @ApiProperty({
        description: "주소",
        required: false,
    })
    @MaxLength(50, {
        message: "주소는 최대 50글자까지 입력할 수 있습니다.",
    })
    @Matches(/^[\s\w\d가-힣]*$/, {
        message: "주소는 한글, 영문, 숫자, 공백만 허용됩니다.",
    })
    address?: string;

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

    @ApiProperty({
        description: "학력",
        required: true,
    })
    @IsArray()
    @ArrayMaxSize(20, {
        message: "학력은 최대 20개까지 입력할 수 있습니다.",
    })
    @Matches(/^[\s\w\d가-힣]{1,30}$/, {
        each: true,
        message: "학력은 한글, 영문, 숫자, 공백만 허용되며, 최대 30글자까지 입력할 수 있습니다.",
    })
    education: string[];

    @ApiProperty({
        description: "한 줄 소개",
        required: true,
    })
    @Matches(/^[\s\w\d가-힣!@#$%^&*()-=_+{}\[\]:;"'<>,.?\\/]{3,100}$/, {
        message: "한 줄 소개는 3글자 이상, 100글자 이하의 한글, 영문, 숫자, 특수문자, 공백으로 입력해주세요.",
    })
    description: string;

    @ApiProperty({
        description: "전화번호",
        required: false,
    })
    @IsOptional()
    @Matches(/^\d{3}-\d{4}-\d{4}$/, {
        message: "전화번호는 '010-1234-5678' 형식으로 입력해주세요.",
    })
    phoneNumber?: string;

    @ApiProperty({
        description: "센터 번호",
        required: true,
    })
    @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/, {
        message: "전화번호는 '지역번호-국번-번호' 형식으로 입력해주세요. (예: 02-1234-5678 또는 031-123-4567)",
    })
    contactNumber: string;

    @ApiProperty({
        description: "카테고리",
        required: true,
        enum: Category,
    })
    category: Category[];

    @ApiProperty({
        description: "상담 가능 시간",
        required: true,
        type: String,
        example: "AM 9:00 ~ AM 10:00",
    })
    @IsString()
    @MinLength(5, {
        each: true,
        message: "상담 가능 시간은 최소 5글자 이상이어야 합니다.",
    })
    availableTime: string;
}