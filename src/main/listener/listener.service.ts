import {
    Injectable,
} from "@nestjs/common";
import {
    $Enums, PrismaClient, Role,
} from "@prisma/client";
import {
    GetAllListenerResponseDto,
} from "@main/listener/dto/res/get-all-listener.response.dto";
import {
    prismaCategoryToCategory,
} from "@main/global/category";
import {
    formatPriceToKRW,
} from "@main/util/format-price.utils";

@Injectable()
export class ListenerService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 상담사 리스트 전체 조회 API
    async getAllListener(): Promise<GetAllListenerResponseDto[]> {
        const listeners = await this.prisma.member.findMany({
            where: {
                role: Role.LISTENER,
                listenerInfoId: {
                    not: null,
                },
            },
            include: {
                listenerInfo: {
                    include: {
                        reviews: {
                            select: {
                                rating: true,
                                comment: true,
                                createdAt: true,
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                },
            },
        });

        return listeners.map((listener) => {
            const categories = listener.listenerInfo!.categories.map(
                (category: $Enums.Category) => prismaCategoryToCategory(category)
            ) || [];

            const formattedPrice = formatPriceToKRW(listener.listenerInfo?.price || 0);

            const reviews = listener.listenerInfo?.reviews || [];
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const reviewCount = reviews.length;
            const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0";
            const recentReview = reviews.length > 0 ? reviews[0].comment : "아직 리뷰가 없습니다.";

            return new GetAllListenerResponseDto(
                listener.id.toString(), listener.nickname, listener.profile, categories, listener.listenerInfo?.description || "", listener.listenerInfo?.address || "", listener.listenerInfo?.contactNumber || "", listener.listenerInfo?.career || [], listener.listenerInfo?.education || [], listener.listenerInfo?.availableTime || [], formattedPrice, reviewCount, averageRating, recentReview,
            );
        });
    }
}