import {
    ApiProperty,
} from "@nestjs/swagger";

export class WriteConsoleResponseDto {
    @ApiProperty({
        description: "Console Id",
        type: String,
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}