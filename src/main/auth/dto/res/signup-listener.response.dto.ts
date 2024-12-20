import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignupListenerResponseDto {
    @ApiProperty({
        type: String,
        description: "Listener Id",
        example: "1",
    })

    readonly id: string;

    constructor(
        id: string,
    ) {
        this.id = id;
    }
}