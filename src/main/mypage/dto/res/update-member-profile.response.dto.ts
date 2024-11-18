import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateMemberProfileResponseDto {
    @ApiProperty({
        description: "Member Id",
        example: "1",
    })
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
