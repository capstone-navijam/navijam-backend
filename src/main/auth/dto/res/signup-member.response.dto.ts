import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignupMemberResponseDto {
    @ApiProperty({
        type: String,
    }) id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}