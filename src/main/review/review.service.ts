import {
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";

import {
    CreateReviewResponseDto,
} from "@main/review/dto/res/create-review.response.dto";
import {
    CreateReviewRequestDto,
} from "@main/review/dto/req/create-review.request.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";

@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 리뷰 작성
    async createReview(memberId: bigint, body: CreateReviewRequestDto): Promise<CreateReviewResponseDto> {

        // 상담사 확인
        const listener = await this.prisma.listenerInfo.findUnique({
            where: {
                id: BigInt(body.listenerId),
            },
        });
        if (!listener) {
            throw new NotFoundListenerException;
        }

        const review = await this.prisma.review.create({
            data: {
                memberId: memberId,
                listenerId: BigInt(body.listenerId),
                rating: body.rating,
                comment: body.comment,
            },
        });

        return new CreateReviewResponseDto(
            review.id.toString(), review.listenerId.toString(), review.rating, review.comment,
        );
    }
}