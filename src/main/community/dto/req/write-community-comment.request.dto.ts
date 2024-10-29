import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class WriteCommunityCommentRequestDto {
    @ApiProperty({
        description: "댓글 내용",
        example: "저도 그 부분은 되게 공감하는 부분이에요.",
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