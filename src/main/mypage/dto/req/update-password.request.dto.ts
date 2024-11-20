import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsNotEmpty, IsString, Matches,
} from "class-validator";

export class UpdatePasswordRequestDto {
    @ApiProperty({
        description: "새 비밀번호",
        example: "newPassword123!",
    })
    @IsString()
    @IsNotEmpty({
        message: "새 비밀번호는 공백일 수 없습니다.",
    })
    @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,14}$/, {
        message: "비밀번호는 8~14글자의 영문, 숫자, 특수문자를 포함해야 합니다.",
    })
    readonly newPassword: string;

    @ApiProperty({
        description: "비밀번호 확인",
        example: "newPassword123!",
    })
    @IsString()
    @IsNotEmpty({
        message: "확인 비밀번호는 공백일 수 없습니다.",
    })
    readonly checkPassword: string;
}