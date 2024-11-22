import {
    ApiProperty,
} from "@nestjs/swagger";

export class UpdateMemberProfileImageResponseDto {
    @ApiProperty({
        description: "Member Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "프로필 이미지 URL",
        example: "https://example.com/profile.png",
    })
    readonly profileUrl: string;

    constructor(id: string, profileUrl: string) {
        this.id = id;
        this.profileUrl = profileUrl;
    }

}