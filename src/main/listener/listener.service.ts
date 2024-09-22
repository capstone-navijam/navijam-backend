import {
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient, Role, $Enums,
} from "@prisma/client";
import {
    GetAllListenerResponseDto,
} from "@main/listener/dto/res/get-all-listener.response.dto";
import {
    prismaCategoryToCategory,
} from "@main/global/category";
import {
    GetListenerDetailResponseDto,
} from "@main/listener/dto/res/get-listener-detail.response.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";

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
                listener.id.toString(), listener.nickname, listener.profile, categories, listener.listenerInfo?.description || "", listener.listenerInfo?.address || "", listener.listenerInfo?.phoneNumber || "", listener.email
            );
        });
    }

    // 상담사 상세 조회 API
    async getDetailListener(id: bigint): Promise<GetListenerDetailResponseDto> {
        const listener = await this.prisma.member.findUnique({
            where: {
                id: id,
            },
            include: {
                listenerInfo: true,
            },
        });

        if (!listener) {
            throw new NotFoundListenerException;
        }

        if (!listener.listenerInfo) {
            throw new NotFoundListenerException;
        }

        const categories = listener.listenerInfo!.categories.map(prismaCategoryToCategory);

        return new GetListenerDetailResponseDto(
            listener.id.toString(), listener.nickname, listener.profile, categories, listener.listenerInfo?.description || "", listener.listenerInfo?.address || "", listener.listenerInfo?.phoneNumber || "", listener.email, listener.listenerInfo?.career || []
        );
    }
}