import {
    Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    ComfortService,
} from "@main/comfort/comfort.service";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    WriteComfortBoardResponseDto,
} from "@main/comfort/dto/res/write-comfort-board.response.dto";
import {
    WriteComfortBoardRequestDto,
} from "@main/comfort/dto/req/write-comfort-board.request.dto";
import CustomResponse from "@main/response/custom-response";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    GetComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-comfort-board.response.dto";
import {
    UpdateComfortBoardResponseDto,
} from "@main/comfort/dto/res/update-comfort-board.response.dto";
import {
    UpdateComfortBoardRequestDto,
} from "@main/comfort/dto/req/update-comfort-board.request.dto";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    GetAllComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-all-comfort-board.response.dto";
import {
    GetAnsweredComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-answered-comfort-board.response.dto";
import {
    GetComfortAndConsolesResponseDto,
} from "@main/comfort/dto/res/get-comfort-console.response.dto";

@ApiTags("위로받기")
@Controller("/comforts")
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)
export class ComfortController {
    constructor(private readonly comfortService: ComfortService) {
    }

    // 위로받기 작성 API
    @ApiOperation({
        summary: "위로받기 작성 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER")
    @ApiCustomResponseDecorator(WriteComfortBoardResponseDto)
    @Post()
    async writeBoard(
        @Req() req: AuthenticatedRequest,
        @Body() body: WriteComfortBoardRequestDto,
    ): Promise<CustomResponse<WriteComfortBoardResponseDto>> {
        const member = req.member;
        const data: WriteComfortBoardResponseDto = await this.comfortService.writeBoard(body, member);

        return new CustomResponse<WriteComfortBoardResponseDto>(data, "게시글 등록 성공");
    }

    // 위로받기 전체 조회 API
    @ApiOperation({
        summary: "위로받기 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("LISTENER")
    @ApiCustomResponseDecorator(GetAllComfortBoardResponseDto)
    @Get("/all")
    async getAllBoards(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetAllComfortBoardResponseDto[]>> {
        const member = req.member;
        const data = await this.comfortService.getAllBoards(member.id);

        return new CustomResponse<GetAllComfortBoardResponseDto[]>(data, "전체 게시글 조회 성공");
    }

    // 특정 멤버 위로받기 전체 조회 API
    @ApiOperation({
        summary: "특정 멤버 위로받기 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER")
    @ApiCustomResponseDecorator(GetComfortBoardResponseDto)
    @Get("/")
    async getMemberBoards(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetComfortBoardResponseDto[]>> {
        const member = req.member;
        const data = await this.comfortService.getMemberBoards(member.id);

        return new CustomResponse<GetComfortBoardResponseDto[]>(data, "게시글 조회 성공");
    }

    // 상담사가 답변한 위로받기 게시글 조회 API
    @ApiOperation({
        summary: "상담사가 답변한 위로받기 게시글 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("LISTENER")
    @ApiCustomResponseDecorator(GetAnsweredComfortBoardResponseDto)
    @Get("/answered")
    async getAnsweredComfortBoards(
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<GetAnsweredComfortBoardResponseDto[]>> {
        const member = req.member;
        const data = await this.comfortService.getAnsweredComfortBoards(member);

        return new CustomResponse<GetAnsweredComfortBoardResponseDto[]>(data, "상담사가 작성한 위로받기 게시글 조회 성공");
    }

    // 위로받기 상세 조회 API
    @ApiOperation({
        summary: "위로받기 상세 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER", "LISTENER")
    @ApiCustomResponseDecorator(GetComfortAndConsolesResponseDto)
    @Get("/:comfortBoardId")
    async getBoardDetail(
        @Req() req: AuthenticatedRequest,
        @Param("comfortBoardId", ParseBigIntPipe) comfortBoardId: bigint,): Promise<CustomResponse<GetComfortAndConsolesResponseDto>> {
        const data = await this.comfortService.getComfortBoardWithConsoles(comfortBoardId);

        return new CustomResponse<GetComfortAndConsolesResponseDto>(data, "게시글 상세 조회 성공");

    }

    // 위로받기 수정 API
    @ApiOperation({
        summary: "위로받기 수정 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(UpdateComfortBoardResponseDto)
    @Patch("/:comfortBoardId")
    async updateBoard(
        @Req() req: AuthenticatedRequest,
        @Param("comfortBoardId", ParseBigIntPipe) comfortBoardId: bigint,
        @Body() body: UpdateComfortBoardRequestDto,
    ): Promise<CustomResponse<UpdateComfortBoardResponseDto>> {
        const memberId = BigInt(req.member.id);
        const updateBoard = await this.comfortService.updateBoard(comfortBoardId, memberId, body);

        return new CustomResponse<UpdateComfortBoardResponseDto>(updateBoard, "게시글 수정 성공");
    }

    // 위로받기 삭제 API
    @ApiOperation({
        summary: "위로받기 삭제 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("MEMBER")
    @Delete("/:comfortBoardId")
    async deleteComfortBoard(
        @Param("comfortBoardId", ParseBigIntPipe) comfortBoardId: bigint,
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<void>> {
        const member = req.member;
        await this.comfortService.deleteComfortBoard(comfortBoardId, member);

        return new CustomResponse<void>(undefined, "위로받기 삭제 성공");
    }
}