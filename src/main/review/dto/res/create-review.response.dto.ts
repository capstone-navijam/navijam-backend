import {
    ApiProperty,
} from "@nestjs/swagger";

export class CreateReviewResponseDto {
    @ApiProperty({
        description: "리뷰 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "상담사의 ID",
        example: "1",
    })
    readonly listenerId: string;

    @ApiProperty({
        description: "별점 (1~5)",
        example: 5,
    })
    readonly rating: number;

    @ApiProperty({
        description: "리뷰 코멘트",
        example: "상담이 정말 유익했어요!",
    })
    readonly comment: string;

    constructor(id: string, listenerId: string, rating: number, comment: string) {
        this.id = id;
        this.listenerId = listenerId;
        this.rating = rating;
        this.comment = comment;
    }
}