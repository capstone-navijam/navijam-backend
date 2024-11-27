import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    IsInt, IsString, Length, Max, Min,
} from "class-validator";

export class CreateReviewRequestDto {
    @ApiProperty({
        description: "Listener ID",
        example: "1",
    })
    readonly listenerId: string;

    @ApiProperty({
        description: "별점 (1~5)",
        example: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    readonly rating: number;

    @ApiProperty({
        description: "리뷰 코멘트 (200자 이내)",
        example: "상담이 정말 유익했어요!",
    })
    @IsString()
    @Length(5, 200)
    readonly comment: string;
}
