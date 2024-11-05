import {
    ApiProperty,
} from "@nestjs/swagger";

export class LikeCommunityResponseDto {
    @ApiProperty({
        description: "좋아요 상태",
        example: true,
    })
    readonly liked: boolean;

    @ApiProperty({
        description: "현재 좋아요 수",
        example: 15,
    })
    readonly likeCount: number;

    constructor(liked: boolean, likeCount: number) {
        this.liked = liked;
        this.likeCount = likeCount;
    }
}