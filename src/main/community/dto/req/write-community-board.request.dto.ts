import {
    IsString, IsNotEmpty, ArrayMaxSize, IsArray, Length, ArrayNotEmpty, IsEnum,
} from "class-validator";
import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class WriteCommunityBoardRequestDto {
    @ApiProperty({
        description: "커뮤니티 글 제목",
        example: "스트레스 해소법 공유",
        required: true,
        maxLength: 40,
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty({
        message: "제목을 작성해주세요.",
    })
    @Length(5, 40, {
        message: "제목은 5~40 글자 사이여야 합니다.",
    })
    readonly title: string;

    @ApiProperty({
        description: "커뮤니티 글 내용",
        example: "요즘 스트레스가 많이 쌓여서 여러분의 스트레스 해소법을 알고 싶어요.",
        required: true,
        minLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @Length(20, undefined, {
        message: "내용은 최소 20글자 이상이어야 합니다.",
    })
    readonly content: string;

    @ApiProperty({
        description: "카테고리 선택 (최대 3개)",
        example: ["건강",
            "정신건강",],
        isArray: true,
    })
    @IsEnum(Category, {
        each: true,
        message: "카테고리를 선택해주세요.",
    })
    @IsArray()
    @ArrayMaxSize(3, {
        message: "카테고리는 최대 3개까지 선택 가능합니다.",
    })
    @ArrayNotEmpty({
        message: "카테고리는 적어도 하나 이상 선택해야 합니다.",
    })
    category: Category[];
}