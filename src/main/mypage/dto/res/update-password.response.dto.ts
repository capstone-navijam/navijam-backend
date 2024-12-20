import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdatePasswordResponseDto {
    @ApiProperty({
        description: "Member Id",
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}