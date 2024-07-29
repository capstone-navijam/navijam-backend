import {
    Injectable,
} from "@nestjs/common";
import {
    Console, Member,
    PrismaClient,
} from "@prisma/client";
import {
    WriteConsoleRequestDto,
} from "@main/console/dto/req/write-console.request.dto";
import {
    WriteConsoleResponseDto,
} from "@main/console/dto/res/write-console.response.dto";
import NotFoundBoardException from "@main/exception/not-found.board.exception";

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
}
