import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Length,
} from "class-validator";

export class UpdateConsoleRequestDto {
    @ApiProperty({
        description: "답변 내용",
        example: "많이 힘드셨을텐데 혼자 고생 많으셨습니다.",
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