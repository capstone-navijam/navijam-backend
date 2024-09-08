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
import NotFoundBoardException from "@main/exception/not-found-board.exception";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console-response.dto";
import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    UpdateConsoleRequestDto,
} from "@main/console/dto/req/update-console.request.dto";
import {
    UpdateConsoleResponseDto,
} from "@main/console/dto/res/update-console.response.dto";
import NotFoundConsoleException from "@main/exception/not-found-console.exception";
import {
    ExistAdoptedConsoleException,
} from "@main/exception/exsist-accpted-console.exception";
import {
    AdoptConsoleResponseDto,
} from "@main/console/dto/res/adopt-console.response.dto";

@Injectable()
export class ConsoleService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 위로하기 작성
    async writeConsole(body: WriteConsoleRequestDto, member: Member
    ): Promise<WriteConsoleResponseDto> {

        const comfortBoard = await this.prisma.comfortBoard.findUnique({
            where: {
                id: body.comfortBoardId,
            },
        });

        if (!comfortBoard) {
            throw new NotFoundBoardException;
        }

        const console: Console = await this.prisma.console.create({
            data: {
                content: body.content,
                memberId: BigInt(member.id),
                comfortId: body.comfortBoardId,
            },
        });

        await this.prisma.comfortBoard.update({
            where: {
                id: body.comfortBoardId,
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

    // 위로하기 전체 조회
    async getAllConsoles(member: Member, comfortBoardId: bigint): Promise<GetAllConsoleResponseDto[]> {
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

    // 위로하기 수정
    async updateConsole(id: bigint, memberId: bigint, member: Member, body: UpdateConsoleRequestDto): Promise<UpdateConsoleResponseDto> {

        const console = await this.prisma.console.findFirst({
            where: {
                id,
            },
        });

        if (!console) {
            throw new NotFoundConsoleException;
        }

        if (console.memberId !== memberId && member.role !== Role.LISTENER) {
            throw new ForbiddenException("접근 권한이 없습니다.");
        }

        const updatedConsole = await this.prisma.console.update({
            where: {
                id,
            },
            data: {
                content: body.content,
                updatedAt: new Date(),
            },
            include: {
                member: true,
            },
        });

        return new UpdateConsoleResponseDto(updatedConsole.id.toString());
    }

    // 위로하기 채택
    async adoptConsole(consoleId: bigint): Promise<AdoptConsoleResponseDto> {
        const console = await this.prisma.console.findUnique({
            where: {
                id: consoleId,
            },
            include: {
                member: true,
                comfort: true,
            },
        });

        if(!console) {
            throw new NotFoundConsoleException;
        }

        if(console.isAdopted) {
            throw new ExistAdoptedConsoleException();
        }

        const existingAdoptedConsole = await this.prisma.console.findFirst({
            where: {
                comfortId: console.comfortId,
                isAdopted: true,
            },
        });

        if(existingAdoptedConsole) {
            throw new ExistAdoptedConsoleException;
        }

        await this.prisma.console.update({
            where: {
                id: console.comfortId,
            },
            data: {
                isAdopted: true,
            },
        });

        return new AdoptConsoleResponseDto(console.id.toString(), true);
    }
}