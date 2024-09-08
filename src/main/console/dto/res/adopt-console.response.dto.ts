import {
    ApiProperty,
} from "@nestjs/swagger";

export class AdoptConsoleResponseDto {

    @ApiProperty({
        type: String,
        description: "Adopted Console Id",
        example: "1",
    })

    readonly id: string;

    @ApiProperty({
        type: Boolean,
        description: "채택 여부",
        example: true,
    })

    readonly isAdopted: boolean;

    constructor(
        id: string,
        isAdopted: boolean
    ) {
        this.id = id;
        this.isAdopted = isAdopted;
    }
}