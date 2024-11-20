import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsOptional, IsString, Matches,
} from "class-validator";

export class UpdateMemberProfileRequestDto {
    @ApiProperty({
        description: "닉네임",
        required: true,
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @Matches(/^[a-zA-Z0-9가-힣]{2,8}$/, {
        message: "닉네임은 2~8글자의 한글 또는 영문자, 숫자여야 합니다.",
    })
    @IsOptional()
    readonly nickname: string;
}