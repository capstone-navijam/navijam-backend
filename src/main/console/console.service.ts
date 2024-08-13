import {
    Injectable,
} from "@nestjs/common";
import {
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

    // 위로하기 전체 조회
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
            (board) =>
                new GetAllComfortBoardResponseDto(
                    board.id.toString(), board.title, board.createdAt
                )
        );
    }

}
