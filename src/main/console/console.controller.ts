import {
    Body,
    Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards,
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
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console.response.dto";
import {
    UpdateConsoleResponseDto,
} from "@main/console/dto/res/update-console.response.dto";
import {
    UpdateConsoleRequestDto,
} from "@main/console/dto/req/update-console.request.dto";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    WriteCommentResponseDto,
} from "@main/console/dto/res/write-comment.response.dto";
import {
    WriteCommentRequestDto,
} from "@main/console/dto/req/write-comment.request.dto";
import {
    GetAllCommentResponseDto,
} from "@main/console/dto/res/get-all-comment.response.dto";

@ApiTags("위로하기")
@Controller("/consoles")
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class ConsoleController {
    constructor(private readonly consoleService: ConsoleService) {
    }

    // 위로하기 작성 API
    @ApiOperation({
        summary: "위로하기 작성 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("LISTENER")
    @ApiCustomResponseDecorator(WriteConsoleResponseDto)
    @Post()
    async writeConsole(
        @Req() req: AuthenticatedRequest,
        @Body() body: WriteConsoleRequestDto,
    ): Promise<CustomResponse<WriteConsoleResponseDto>> {
        const member = req.member;
        const data: WriteConsoleResponseDto = await this.consoleService.writeConsole(body, member);

        return new CustomResponse<WriteConsoleResponseDto>(data, "답변 등록 성공");
    }

    // 위로하기 댓글 작성 API
    @ApiOperation({
        summary: "위로하기 댓글 작성 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @ApiCustomResponseDecorator(WriteCommentResponseDto)
    @Post("/:consoleId/comments")
    async writeComment(
        @Param("consoleId", ParseBigIntPipe) consoleId: bigint,
        @Body() body: WriteCommentRequestDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<WriteCommentResponseDto>> {
        const member = req.member;
        const data: WriteCommentResponseDto = await this.consoleService.writeComment(consoleId, body, member);

        return new CustomResponse<WriteCommentResponseDto>(data, "댓글 등록 성공");
    }

    // 위로하기 전체 조회 API
    @ApiOperation({
        summary: "위로하기 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @ApiCustomResponseDecorator(GetAllConsoleResponseDto)
    @Get()
    async getAllConsoles(
        @Req() req: AuthenticatedRequest,
        @Query("comfortBoardId", ParseBigIntPipe) comfortBoardId: bigint,
    ): Promise<CustomResponse<GetAllConsoleResponseDto[]>> {
        const member = req.member;
        const data = await this.consoleService.getAllConsoles(member, comfortBoardId);

        return new CustomResponse<GetAllConsoleResponseDto[]>(data, "위로하기 전체 조회 성공");
    }

    // 위로하기 댓글 전체 조회 API
    @ApiOperation({
        summary: "위로하기 댓글 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @ApiCustomResponseDecorator(GetAllCommentResponseDto)
    @Get("/:consoleId/comments")
    async getAllComments(
        @Req() req: AuthenticatedRequest,
        @Param("consoleId", ParseBigIntPipe) consoleId: bigint,
    ): Promise<CustomResponse<GetAllCommentResponseDto[]>> {
        const member = req.member;
        const comments = await this.consoleService.getAllComments(member, consoleId);

        return new CustomResponse<GetAllCommentResponseDto[]>(comments, "댓글 조회 성공");
    }

    // 위로하기 수정 API
    @ApiOperation({
        summary: "위로하기 수정 API",
    })
    @UseGuards(JwtAuthGuard)
    @Roles("LISTENER")
    @ApiCustomResponseDecorator(UpdateConsoleResponseDto)
    @Patch("/:consoleId")
    async updateConsole(
        @Req() req: AuthenticatedRequest,
        @Param("consoleId", ParseBigIntPipe) consoleId: bigint,
        @Body() body: UpdateConsoleRequestDto,
    ): Promise<CustomResponse<UpdateConsoleResponseDto>> {
        const member = req.member;
        const memberId = BigInt(req.member.id);

        const updateConsole = await this.consoleService.updateConsole(consoleId, memberId, member, body);

        return new CustomResponse<UpdateConsoleResponseDto>(updateConsole, "답변 수정 성공");

    }

    // 위로하기 삭제 API
    @ApiOperation({
        summary: "위로하기 삭제 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("LISTENER")
    @Delete("/:consoleId")
    async deleteConsole(
        @Param("consoleId", ParseBigIntPipe) consoleId: bigint,
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<void>> {
        const member = req.member;

        await this.consoleService.deleteConsole(consoleId, member);

        return new CustomResponse<void>(undefined, "위로하기 삭제 성공");
    }

    // 위로하기 댓글 삭제 API
    @ApiOperation({
        summary: "위로하기 댓글 삭제 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @Delete("/:commentId/comments")
    async deleteComment(
        @Param("commentId", ParseBigIntPipe) commentId: bigint,
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<void>> {
        const member = req.member;

        await this.consoleService.deleteComment(commentId, member);

        return new CustomResponse<void>(undefined, "위로하기 댓글 삭제 성공");
    }

}