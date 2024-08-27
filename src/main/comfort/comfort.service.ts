import {
    Injectable,
} from "@nestjs/common";
import {
    ComfortBoard, Member,
    PrismaClient,
} from "@prisma/client";
import {
    WriteComfortBoardRequestDto,
} from "@main/comfort/dto/req/write-comfort-board.request.dto";
import {
    WriteComfortBoardResponseDto,
} from "@main/comfort/dto/res/write-comfort-board.response.dto";
import {
    categoryMap, prismaCategoryToCategory,
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
import {
    GetComfortBoardDetailResponseDto,
} from "@main/comfort/dto/res/get-comfort-board-detail.response.dto";
import {
    GetAllComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-all-comfort-board.response.dto";
import {
    getTimestamp,
} from "@main/util/timestamp.util";

@Injectable()
export class ComfortService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 위로받기 작성
    async writeBoard(writeComfortBoardRequestDto: WriteComfortBoardRequestDto, member: Member): Promise<WriteComfortBoardResponseDto> {

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

    // 위로받기 전체 조회
    async getAllBoards(): Promise<GetAllComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            include: {
                member: true,
            },
        });

        return boards.map(board => {

            const categories = board.categories.map(prismaCategoryToCategory);

            return new GetAllComfortBoardResponseDto(
                board.id.toString(), categories, board.title, board.createdAt,
            );
        });
    }

    // 특정 멤버 위로받기 전체 조회
    async getMemberBoards(memberId: bigint): Promise<GetComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            where: {
                memberId,
            },
            include: {
                member: true,
            },
        });

        return boards.map(board => new GetComfortBoardResponseDto(
            board.id.toString(), board.title, board.createdAt,
        ));
    }

    // 위로받기 상세 조회
    async getBoardDetail(id: bigint): Promise<GetComfortBoardDetailResponseDto> {
        const board = await this.prisma.comfortBoard.findUnique({
            where: {
                id,
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

        return new GetComfortBoardDetailResponseDto(
            board.id.toString(), board.member?.profile || "", board.member?.nickname || "", categories, board.title, board.content, board.memberId?.toString() || "Unknown", timestamp,
        );
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