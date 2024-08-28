import {
    Body,
    Controller, Get, Param, ParseIntPipe, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    ConsoleService,
} from "@main/console/console.service";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    WriteConsoleResponseDto,
} from "@main/console/dto/res/write-console.response.dto";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    WriteConsoleRequestDto,
} from "@main/console/dto/req/write-console.request.dto";
import CustomResponse from "@main/response/custom-response";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";
import {
    Role,
} from "@prisma/client";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console-response.dto";

@ApiTags("위로하기")
@Controller("/consoles")
@UseFilters(CustomUnauthorizedExceptionFilter)
export class ConsoleController {
    constructor(private readonly consoleService: ConsoleService) {
    }

    // 위로하기 작성 API
    @ApiOperation({
        summary: "위로하기 작성 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.LISTENER)
    @ApiCustomResponseDecorator(WriteConsoleResponseDto)
    @Post("/:comfortBoardId")
    async writeConsole(
        @Req() req: AuthenticatedRequest,
        @Param("comfortBoardId", ParseBigIntPipe) comfortBoardId: bigint,
        @Body() body: WriteConsoleRequestDto,
    ): Promise<CustomResponse<WriteConsoleResponseDto>> {
        const member = req.member;
        const data: WriteConsoleResponseDto = await this.consoleService.writeConsole(body, member, comfortBoardId);

        return new CustomResponse<WriteConsoleResponseDto>(data, "답변 등록 성공");
    }

    // 위로하기 전체 조회 API
    @ApiOperation({
        summary: "위로하기 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @Get("/:comfortBoardId")
    async getAllConsoles(
        @Req() req: AuthenticatedRequest,
        @Param("comfortBoardId", ParseIntPipe) comfortBoardId: bigint,
    ): Promise<CustomResponse<GetAllConsoleResponseDto[]>> {
        const member = req.member;
        const data = await this.consoleService.getAllConsoles(member, comfortBoardId);

        return new CustomResponse<GetAllConsoleResponseDto[]>(data, "위로하기 전체 조회 성공");
    }
}