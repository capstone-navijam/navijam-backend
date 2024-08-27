import {
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import {
    ComfortBoard,
    Console, Member,
    PrismaClient, Role,
} from "@prisma/client";
import {
    WriteConsoleRequestDto,
} from "@main/console/dto/req/write-console.request.dto";
import {
    WriteConsoleResponseDto,
} from "@main/console/dto/res/write-console.response.dto";
import NotFoundBoardException from "@main/exception/not-found.board.exception";
import {
    GetAllComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-all-comfort-board.response.dto";
import {
    prismaCategoryToCategory,
} from "@main/global/category";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console.response.dto";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";

@Injectable()
export class ConsoleService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 위로하기 작성
    async writeConsole(writeConsoleRequestDto: WriteConsoleRequestDto, member: Member, comfortBoardId: bigint
    ): Promise<WriteConsoleResponseDto> {

        const comfortBoard = await this.prisma.comfortBoard.findUnique({
            where: {
                id: comfortBoardId,
            },
        });

        if (!comfortBoard) {
            throw new NotFoundBoardException;
        }

        const console: Console = await this.prisma.console.create({
            data: {
                content: writeConsoleRequestDto.content,
                memberId: BigInt(member.id),
                comfortId: comfortBoardId,
            },
        });

        return new WriteConsoleResponseDto(console.id.toString());
    }

    // 위로하기 답변 게시글 전체 조회
    async getAllBoards(listenerId: bigint): Promise<GetAllComfortBoardResponseDto[]> {
        const consoles = await this.prisma.console.findMany({
            where: {
                memberId: listenerId,
                member: {
                    role: Role.LISTENER,
                },
            },
            include: {
                comfort: true,
            },
        });

        const boards = consoles.map((console) => console.comfort);

        const uniqueBoardIds = Array.from(new Set(boards.map((board) => board?.id)));

        const uniqueBoards = uniqueBoardIds
            .map((id) => boards.find((board) => board?.id === id))
            .filter((board): board is typeof boards[number] => board !== undefined);

        return uniqueBoards.map(
            (board) => {
                const categories = board.categories.map(prismaCategoryToCategory); // board.categories에 접근하여 매핑

                return new GetAllComfortBoardResponseDto(
                    board.id.toString(), categories, board.title, board.createdAt,
                );
            }
        );
    }

    // 위로하기 전체 조회
    async getAllConsoles(comfortBoardId: bigint, member: Member): Promise<GetAllConsoleResponseDto[]> {
        const consoles = await this.prisma.console.findMany({
            where: {
                comfortId: comfortBoardId, // 특정 comfortBoardId에 맞는 답글만 가져옴
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                comfort: {
                    select: {
                        id: true,
                        memberId: true,
                        title: true,
                    },
                },
                member: {
                    select: {
                        id: true,
                        nickname: true,
                        profile: true,
                    },
                },
            },
        });
        if (member.role === Role.LISTENER) {
            return consoles.map(console => new GetAllConsoleResponseDto(
                console.id.toString(), console.member?.nickname || "Anonymous", console.member?.profile || "default-profile-url", console.content, console.createdAt, console.updatedAt
            ));
        }

        const isMemberAuthorized = consoles.some(console => console.comfort?.memberId === member.id);

        if (!isMemberAuthorized) {
            return consoles.map(console => new GetAllConsoleResponseDto(
                console.id.toString(), console.member?.nickname || "Anonymous", console.member?.profile || "default-profile-url", console.content, console.createdAt, console.updatedAt
            ));
        } else {
            throw new ForbiddenException();
        }
    }
}
