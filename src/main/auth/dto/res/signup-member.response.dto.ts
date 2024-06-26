import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignupMemberResponseDto {
    @ApiProperty({
        type: String,
        description: "Member id",
        example: "1",
    })

    readonly id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}