import {
    ForbiddenException, Injectable,
} from "@nestjs/common";
import {
    ComfortBoard, Member, PrismaClient, Role,
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
import {
    GetAnsweredComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-answered-comfort-board.response.dto";
import {
    GetComfortAndConsolesResponseDto,
} from "@main/comfort/dto/res/get-comfort-console.response.dto";
import {
    mapToComfortAndConsolesDto,
} from "@main/util/comfort-console-map";

@Injectable()
export class ComfortService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 위로받기 작성
    async writeBoard(body: WriteComfortBoardRequestDto, member: Member): Promise<WriteComfortBoardResponseDto> {

        const board: ComfortBoard = await this.prisma.comfortBoard.create({
            data: {
                title: body.title,
                content: body.content,
                categories: body.category.map(category => categoryMap[category.toString()]),
                memberId: BigInt(member.id),
            },
        });

        return new WriteComfortBoardResponseDto(board.id.toString());
    }

    // 위로받기 전체 조회
    async getAllBoards(memberId: bigint): Promise<GetAllComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            include: {
                member: true,
                consoles: true,
            },
        });

        return boards.map(board => {

            const categories = board.categories.map(prismaCategoryToCategory);

            const hasAnswer = board.consoles.some(console => console.memberId === memberId);

            const timestamp = getTimestamp(board.createdAt, board.updatedAt, "date");

            return new GetAllComfortBoardResponseDto(
                board.id.toString(), categories, board.title, board.content, board.member!.id.toString(), board.member!.profile, board.member!.nickname, timestamp, hasAnswer
            );
        });
    }

    // 특정 멤버 위로받기 전체 조회
    async getMemberBoards(memberId: bigint): Promise<GetComfortBoardResponseDto[]> {
        const boards = await this.prisma.comfortBoard.findMany({
            where: {
                memberId: memberId,
            },
            include: {
                member: true,
            },
        });

        return boards.map((board) => {
            const timestamp = getTimestamp(board.createdAt, board.updatedAt, "date");

            return new GetComfortBoardResponseDto(board.id.toString(), board.title, timestamp);
        });
    }

    // 위로받기 상세 조회
    async getBoardDetail(comfortBoardId: bigint): Promise<GetComfortBoardDetailResponseDto> {
        const board = await this.prisma.comfortBoard.findUnique({
            where: {
                id: comfortBoardId,
            },
            include: {
                member: true,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const timestamp = getTimestamp(board.createdAt, board.updatedAt, "datetime");

        const categories = board.categories.map(prismaCategoryToCategory);

        return new GetComfortBoardDetailResponseDto(
            board.id.toString(), board.member?.profile || "", board.member?.nickname || "", categories, board.title, board.content, board.memberId?.toString() || "", timestamp,
        );
    }

    // 임시 API
    async getComfortBoardWithConsoles(comfortBoardId: bigint): Promise<GetComfortAndConsolesResponseDto> {
        const board = await this.prisma.comfortBoard.findUnique({
            where: {
                id: comfortBoardId,
            },
            include: {
                member: true,
                consoles: true,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const consoles = await this.prisma.console.findMany({
            where: {
                comfortId: comfortBoardId,
            },
            include: {
                member: true,
            },
        });

        return mapToComfortAndConsolesDto(board, consoles);
    }

    // 상담사가 답변한 위로받기 게시글 조회
    async getAnsweredComfortBoards(member: Member): Promise<GetAnsweredComfortBoardResponseDto[]> {
        const consoles = await this.prisma.console.findMany({
            where: {
                memberId: member.id,
                member: {
                    role: Role.LISTENER,
                },
            },
            include: {
                comfort: true,
            },
        });

        return consoles.map(console => {
            if (console.comfort) {
                const categories = console.comfort.categories.map(prismaCategoryToCategory);

                const timestamp = getTimestamp(console.comfort.createdAt, console.comfort.updatedAt, "date");

                return new GetAnsweredComfortBoardResponseDto(
                    console.comfort.id.toString(), categories, console.comfort.title, timestamp,
                );
            }
            throw new Error("데이터가 존재하지 않습니다.");
        });
    }

    // 위로받기 수정
    async updateBoard(comfortBoardId: bigint, memberId: bigint, body: UpdateComfortBoardRequestDto): Promise<UpdateComfortBoardResponseDto> {

        const board = await this.prisma.comfortBoard.findFirst({
            where: {
                id: comfortBoardId,
                memberId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const updatedBoard = await this.prisma.comfortBoard.update({
            where: {
                id: comfortBoardId,
            },
            data: {
                title: body.title,
                content: body.content,
                updatedAt: new Date(),
            },
            include: {
                member: true,
            },
        });

        return new UpdateComfortBoardResponseDto(updatedBoard.id.toString());
    }

    // 위로받기 삭제
    async deleteComfortBoard(comfortBoardId: bigint, member: Member): Promise<void> {
        const comfortBoard = await this.prisma.comfortBoard.findUnique({
            where: {
                id: comfortBoardId,
            },
        });

        if (!comfortBoard) {
            throw new NotFoundBoardException;
        }

        if (comfortBoard.memberId !== member.id) {
            throw new ForbiddenException;
        }

        await this.prisma.$transaction(async (prisma) => {
            await prisma.consoleComment.deleteMany({
                where: {
                    console: {
                        comfortId: comfortBoardId,
                    },
                },
            });

            await prisma.console.deleteMany({
                where: {
                    comfortId: comfortBoardId,
                },
            });

            await prisma.comfortBoard.delete({
                where: {
                    id: comfortBoardId,
                },
            });
        });
    }
}