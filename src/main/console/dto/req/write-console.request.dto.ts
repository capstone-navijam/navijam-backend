import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class WriteConsoleRequestDto {
    @ApiProperty({
        description: "위로받기 게시글 답글(위로하기)",
        example: "충분히 공감하는 사연입니다.",
        required: true,
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty({
        message: "내용을 작성해주세요.",
    })
    @Length(5, undefined, {
        message: "내용은 최소 5글자 이상이어야 합니다.",
    })
    readonly content: string;
}