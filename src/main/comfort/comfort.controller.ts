import {
    Body,
    Controller, Get, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
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

@ApiTags("위로받기")
@Controller("/comforts")
@UseFilters(CustomUnauthorizedExceptionFilter)
export class ComfortController {
    constructor(private readonly comfortService: ComfortService) {
    }

    // 위로받기 작성 API
    @ApiOperation({
        summary: "위로받기 작성 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(WriteComfortBoardResponseDto)
    @Post("/")
    async writeBoard(
        @Req() req: AuthenticatedRequest,
        @Body() body: WriteComfortBoardRequestDto,
    ): Promise<CustomResponse<WriteComfortBoardResponseDto>> {
        const member = req.member;
        const data: WriteComfortBoardResponseDto = await this.comfortService.writeBoard(body, member);

        return new CustomResponse<WriteComfortBoardResponseDto>(data, "게시글이 등록되었습니다.");
    }

    // 특정 멤버 위로받기 전체 조회 API
    @ApiOperation({
        summary: "위로받기 전체 조회 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(GetComfortBoardResponseDto)
    @Get("/")
    async getAllBoards(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetComfortBoardResponseDto[]>> {
        const member = req.member;
        const data = await this.comfortService.getAllBoards(member.id.toString());

        return new CustomResponse<GetComfortBoardResponseDto[]>(data, "게시글 조회 성공");
    }
}