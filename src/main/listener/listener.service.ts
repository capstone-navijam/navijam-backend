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
                listenerInfo: true,
            },
        });

        return listeners.map((listener) => {
            const categories = listener.listenerInfo!.categories.map(
                (category: $Enums.Category) => prismaCategoryToCategory(category)
            ) || [];

            return new GetAllListenerResponseDto(
                listener.id.toString(), listener.nickname, listener.profile, categories, listener.listenerInfo?.description || "", listener.listenerInfo?.address || "", listener.listenerInfo?.contactNumber || "", listener.listenerInfo?.career || [], listener.listenerInfo?.education || [], listener.listenerInfo?.availableTime || []
            );
        });
    }
}