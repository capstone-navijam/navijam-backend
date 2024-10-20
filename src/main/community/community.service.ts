import {
    Injectable,
} from "@nestjs/common";
import {
    Member,
    PrismaClient,
    CommunityBoard,
} from "@prisma/client";
import {
    WriteCommunityBoardRequestDto,
} from "@main/community/dto/req/write-community-board.request.dto";
import {
    categoryMap, prismaCategoryToCategory,
} from "@main/global/category";
import {
    WriteCommunityBoardResponseDto,
} from "@main/community/dto/res/write-community-board.response.dto";
import {
    GetCommunityBoardDetailResponseDto,
} from "@main/community/dto/res/get-community-board-detail.response.dto";
import NotFoundBoardException from "@main/exception/not-found.board.exception";
import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    GetAllCommunityBoardResponseDto,
} from "@main/community/dto/res/get-all-community-board.response.dto";

@Injectable()
export class CommunityService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 커뮤니티 글 작성
    async writeCommunity(member: Member, body: WriteCommunityBoardRequestDto): Promise<WriteCommunityBoardResponseDto> {

        const board = await this.prisma.communityBoard.create({
            data: {
                title: body.title,
                content: body.content,
                categories: body.category.map(category => categoryMap[category.toString()]),
                memberId: BigInt(member.id),
            },
        });

        return new WriteCommunityBoardResponseDto(board.id.toString());
    }

    // 커뮤니티 전체 조회
    async getAllCommunity(): Promise<GetAllCommunityBoardResponseDto[]> {
        const boards = await this.prisma.communityBoard.findMany({
            include: {
                member: true,
            },
        });

        return boards.map((board) => {

            const categories = board.categories.map(prismaCategoryToCategory);

            const memberProfile = board.member?.profile || "";
            const memberNickname = board.member?.nickname || "";
            const memberId = board.member?.id?.toString() || "";

            const timestamp = getTimestamp(board.createdAt, board.updatedAt);
            
            return new GetAllCommunityBoardResponseDto(
                board.id.toString(), memberProfile, memberNickname, categories, board.title, board.content, timestamp, memberId
            );
        });
    }

    // 커뮤니티 상세 조회
    async getCommunityDetail(communityBoardId: bigint): Promise<GetCommunityBoardDetailResponseDto> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
            include: {
                member: true,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const timestamp = getTimestamp(board.createdAt, board.updatedAt);

        const categories = board.categories.map(prismaCategoryToCategory);

        return new GetCommunityBoardDetailResponseDto(
            board.id.toString(), board.member?.profile || "", board.member?.nickname || "", categories, board.title, board.content, board.memberId?.toString() || "", timestamp,
        );
    }
}
