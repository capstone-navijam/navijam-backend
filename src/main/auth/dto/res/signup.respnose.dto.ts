import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignUpResponseDto {
    @ApiProperty({
        type: String,
    }) id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}