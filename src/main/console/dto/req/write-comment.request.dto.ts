import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class WriteCommentRequestDto {
    @ApiProperty({
        description: "댓글 내용",
        example: "더 자세한 상담을 원하신다면, 개인 상담을 요청해주세요.",
        required: true,
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty({
        message: "댓글을 작성해주세요.",
    })
    @Length(5, 100, {
        message: "댓글은 최소 5글자 이상, 100글자 이하입니다.",
    })
    readonly content: string;
};