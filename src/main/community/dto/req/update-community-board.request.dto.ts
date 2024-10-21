import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class UpdateCommunityBoardRequestDto {
    @ApiProperty({
        description: "커뮤니티 글 제목",
        example: "스트레스 해소법 알려주세요(수정)",
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
        example: "각자 자신만의 스트레스 해소법 좀 알려주세요.(수정)",
        required: true,
        minLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @Length(20, undefined, {
        message: "내용은 최소 20글자 이상이어야 합니다.",
    })
    readonly content: string;
}