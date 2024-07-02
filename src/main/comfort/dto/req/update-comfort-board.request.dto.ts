import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class UpdateComfortBoardRequestDto {
    @ApiProperty({
        description: "위로받기 게시글 제목",
        example: "수정된 제목",
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
        description: "게시글 내용",
        example: "요즘 너무 지치는 일들이 많아 스트레스입니다 (수정).",
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
}