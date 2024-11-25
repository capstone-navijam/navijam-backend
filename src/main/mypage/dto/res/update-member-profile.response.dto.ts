import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateMemberProfileResponseDto {
    @ApiProperty({
        description: "Member Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "닉네임",
        example: "난이춘식",
    })
    readonly nickname: string;

    constructor(id: string, nickname: string) {
        this.id = id;
        this.nickname = nickname;
    }
}
