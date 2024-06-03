import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignupListenerResponseDto {
    @ApiProperty({
        type: String,
    }) id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}