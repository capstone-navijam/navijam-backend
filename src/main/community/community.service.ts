import {
    Injectable,
} from "@nestjs/common";
import {
    CommunityBoard,
    Member,
    PrismaClient,
} from "@prisma/client";
import {
    WriteCommunityBoardRequestDto,
} from "@main/community/dto/req/write-community-board.request.dto";
import {
    categoryMap,
} from "@main/global/category";
import {
    WriteCommunityBoardResponseDto,
} from "@main/community/dto/res/write-community-board.response.dto";

@Injectable()
export class CommunityService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 커뮤니티 글 작성
    async writeCommunity(member: Member, body: WriteCommunityBoardRequestDto): Promise<WriteCommunityBoardResponseDto> {

        const board: CommunityBoard = await this.prisma.communityBoard.create({
            data: {
                title: body.title,
                content: body.content,
                categories: body.category.map(category => categoryMap[category.toString()]),
                memberId: BigInt(member.id),
            },
        });

        return new WriteCommunityBoardResponseDto(board.id.toString());
    }

}
