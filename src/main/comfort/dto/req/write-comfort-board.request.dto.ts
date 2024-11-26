import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    ArrayMaxSize, ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, Length,
} from "class-validator";
import {
    Category,
} from "@main/global/category";

export class WriteComfortBoardRequestDto {
    @ApiProperty({
        description: "위로받기 게시글 제목",
        example: "조언 부탁드립니다.",
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
        description: "위로받기 게시글 내용",
        example: "요즘 너무 지치는 일들이 많아 스트레스입니다.",
        required: true,
        minLength: 20,
    })
    @IsString()
    @IsNotEmpty({
        message: "내용을 작성해주세요.",
    })
    @Length(20, undefined, {
        message: "내용은 최소 20글자 이상이어야 합니다.",
    })
    readonly content: string;

    @ApiProperty({
        description: "위로받기 게시글 주제",
        example: ["가족",
            "정신건강",],
        required: true,
        enum: Category,
        isArray: true,
    })
    @IsArray()
    @IsEnum(Category, {
        each: true,
        message: "카테고리를 선택해주세요.",
    }
    )
    @ArrayMaxSize(3, {
        message: "카테고리는 최대 3개까지 선택 가능합니다.",
    })
    @ArrayNotEmpty({
        message: "카테고리는 적어도 하나 이상 선택해야 합니다.",
    })
    readonly category: Category[];
}