import {
    Injectable, NotFoundException,
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
import {
    UpdateComfortBoardRequestDto,
} from "@main/comfort/dto/req/update-comfort-board.request.dto";
import {
    UpdateComfortBoardResponseDto,
} from "@main/comfort/dto/res/update-comfort-board.response.dto";
import NotFoundBoardException from "@main/exception/not-found.board.exception";

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
                memberId: BigInt(member.id),
            },
        });

        return new WriteComfortBoardResponseDto(board.id.toString());
    }

    // 특정 멤버 위로받기 전체 조회
    async getAllBoards(memberId: bigint): Promise<GetComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            where: {
                memberId,
            },
            include: {
                member: true,
            },
        });

        return boards.map(board => new GetComfortBoardResponseDto(
            board.id.toString(), board.title, board.content, board.member?.nickname || "", board.member?.profile || "", board.createdAt,
        ));
    }

    // 위로받기 수정
    async updateBoard(id: bigint, memberId: bigint, updateComfortBoardRequestDto: UpdateComfortBoardRequestDto): Promise<UpdateComfortBoardResponseDto> {

        const board = await this.prisma.comfortBoard.findFirst({
            where: {
                id,
                memberId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const updatedBoard = await this.prisma.comfortBoard.update({
            where: {
                id,
            },
            data: {
                title: updateComfortBoardRequestDto.title,
                content: updateComfortBoardRequestDto.content,
                updatedAt: new Date(),
            },
            include: {
                member: true,
            },
        });

        return new UpdateComfortBoardResponseDto(updatedBoard.id.toString());
    }
}