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
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console-response.dto";
import {
    getTimestamp,
} from "@main/util/timestamp.util";

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

        await this.prisma.comfortBoard.update({
            where: {
                id: comfortBoardId,
            },
            data: {
                isAnswered: true,
            },
        });

        return new WriteConsoleResponseDto(console.id.toString());
    }

    async getComfortBoardById(id: bigint): Promise<ComfortBoard | null> {
        return this.prisma.comfortBoard.findUnique({
            where: {
                id,
            },
        });
    }

    // 위로하기 전체 조회 API
    async getAllConsoles(member: Member, comfortBoardId: bigint) :Promise<GetAllConsoleResponseDto[]> {
        const comfortBoard = await this.getComfortBoardById(comfortBoardId);

        if (!comfortBoard) {
            throw new NotFoundBoardException;
        }

        if (comfortBoard.memberId !== member.id && member.role !== Role.LISTENER) {
            throw new ForbiddenException("접근 권한이 없습니다.");
        }

        const consoles = await this.prisma.console.findMany({
            where: {
                comfortId: comfortBoardId,
            },
            include: {
                member: true,
            },
        });

        return consoles.map(console => {
            const timestamp = getTimestamp(console.createdAt, console.updatedAt);

            const memberId = console.member.id.toString();

            return new GetAllConsoleResponseDto(
                console.id.toString(), console.member.nickname, console.member.profile, console.content, timestamp, memberId,
            );
        });
    }

}
