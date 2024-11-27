import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetListenerReviewsResponseDto {
    @ApiProperty({
        description: "상담사 ID",
        example: "1",
    })
    readonly listenerId: string;

    @ApiProperty({
        description: "리뷰 평균 점수 (소수점 1자리)",
        example: "4.5",
    })
    readonly averageRating: string;

    @ApiProperty({
        description: "리뷰 개수",
        example: 25,
    })
    readonly reviewCount: number;

    @ApiProperty({
        description: "리뷰 코멘트",
        example: "친절하고 유익한 상담이었습니다.",
    })
    readonly comment: string;

    @ApiProperty({
        description: "리뷰 작성 시간",
        example: "2024-01-02 15:30:00",
    })
    readonly timestamp: string;

    constructor(listenerId: string, averageRating: string, reviewCount: number, comment: string, timestamp: string) {
        this.listenerId = listenerId;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.comment = comment;
        this.timestamp = timestamp;
    }
}
