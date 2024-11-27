import {
    Body,
    Controller, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    CreateReviewResponseDto,
} from "@main/review/dto/res/create-review.response.dto";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CreateReviewRequestDto,
} from "@main/review/dto/req/create-review.request.dto";
import CustomResponse from "@main/response/custom-response";
import {
    ReviewService,
} from "@main/review/review.service";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";

@ApiTags("리뷰")
@Controller("/review")
@UseGuards(JwtAuthGuard)
@UseFilters(CustomUnauthorizedExceptionFilter, CustomUnauthorizedExceptionFilter)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    // 리뷰 작성 API
    @ApiOperation({
        summary: "리뷰 작성 API",
    })
    @ApiCustomResponseDecorator(CreateReviewResponseDto)
    @UseGuards(RolesGuard)
    @Roles("LISTENER")
    @Post()
    async createReview(
        @Req() req: AuthenticatedRequest,
        @Body() body: CreateReviewRequestDto,
    ): Promise<CustomResponse<CreateReviewResponseDto>> {
        const memberId = BigInt(req.member.id);
        const data = await this.reviewService.createReview(memberId, body);

        return new CustomResponse<CreateReviewResponseDto>(data, "리뷰 작성 성공");
    }
}