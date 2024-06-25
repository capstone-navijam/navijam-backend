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

@Injectable()
export class ComfortService {
    constructor(private readonly prisma: PrismaClient) {
    }

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
}