import {
    Injectable,
} from "@nestjs/common";
import {
    ComfortBoard,
    PrismaClient,
} from "@prisma/client";
import {
    WriteComfortBoardRequestDto,
} from "@main/comfort/dto/req/write-comfort-board.request.dto";
import {
    WriteComfortBoardResponseDto,
} from "@main/comfort/dto/res/write-comfort-board.response.dto";
import {
    categoryMap,
} from "@main/global/category";
import {
    GetComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-comfort-board.response.dto";

@Injectable()
export class ComfortService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 위로받기 작성
    async writeBoard(writeComfortBoardRequestDto: WriteComfortBoardRequestDto, member: any): Promise<WriteComfortBoardResponseDto> {

        const board: ComfortBoard = await this.prisma.comfortBoard.create({
            data: {
                title: writeComfortBoardRequestDto.title,
                content: writeComfortBoardRequestDto.content,
                categories: writeComfortBoardRequestDto.category.map(category => categoryMap[category.toString()]),
                memberId: member.id,
            },
        });

        return new WriteComfortBoardResponseDto(board.id.toString());
    }

    // 특정 멤버 위로받기 전체 조회
    async getAllBoards(memberId: string): Promise<GetComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            where: {
                memberId: BigInt(memberId),
            },
            include: {
                member: true,
            },
        });

        return boards.map(board => new GetComfortBoardResponseDto(
            board.id.toString(), board.title, board.content, board.member?.nickname || "", board.member?.profile || "", board.createdAt,
        ));
    }
}