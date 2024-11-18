import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsOptional, IsString, Matches, ValidateIf,
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
    readonly nickname?: string;

    @ApiProperty({
        description: "비밀번호",
        required: true,
    })
    @IsString({})
    @IsNotEmpty({
        message: "공백을 포함할 수 없습니다.",
    })
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {
        message: "비밀번호는 8~14글자의 영문, 숫자, 특수문자를 포함해야 합니다.",
    })
    @IsOptional()
    readonly newPassword?: string;

    @ApiProperty({
        description: "비밀번호 확인",
        required: true,
    })
    @IsOptional()
    @ValidateIf((o) => o.newPassword !== undefined)
    readonly checkPassword?: string;
}