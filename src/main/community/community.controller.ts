import {
    Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    CommunityService,
} from "@main/community/community.service";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    WriteCommunityBoardResponseDto,
} from "@main/community/dto/res/write-community-board.response.dto";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import CustomResponse from "@main/response/custom-response";
import {
    WriteCommunityBoardRequestDto,
} from "@main/community/dto/req/write-community-board.request.dto";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";
import {
    GetCommunityBoardDetailResponseDto,
} from "@main/community/dto/res/get-community-board-detail.response.dto";
import {
    GetAllCommunityBoardResponseDto,
} from "@main/community/dto/res/get-all-community-board.response.dto";
import {
    UpdateCommunityBoardResponseDto,
} from "@main/community/dto/res/update-community-board.response.dto";
import {
    UpdateCommunityBoardRequestDto,
} from "@main/community/dto/req/update-community-board.request.dto";
import {
    WriteCommunityCommentResponseDto,
} from "@main/community/dto/res/write-community-comment.response.dto";
import {
    WriteCommunityCommentRequestDto,
} from "@main/community/dto/req/write-community-comment.request.dto";
import {
    GetAllCommunityCommentResponseDto,
} from "@main/community/dto/res/get-all-community-comment.response.dto";
import {
    LikeCommunityResponseDto,
} from "@main/community/dto/res/like-community-response.dto";
import {
    OptionalJwtAuthGuard,
} from "@main/auth/jwt/optional-jwt.guard";

@ApiTags("커뮤니티")
@Controller("/community")
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class CommunityController {
    constructor(private readonly communityService: CommunityService) {
    }

    // 커뮤니티 작성 API
    @ApiOperation({
        summary: "커뮤니티 작성 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(WriteCommunityBoardResponseDto)
    @Post()
    async writeCommunity(
        @Req() req: AuthenticatedRequest,
        @Body() body: WriteCommunityBoardRequestDto,
    ): Promise<CustomResponse<WriteCommunityBoardResponseDto>> {
        const member = req.member;
        const data: WriteCommunityBoardResponseDto = await this.communityService.writeCommunity(member, body);

        return new CustomResponse<WriteCommunityBoardResponseDto>(data, "커뮤니티 게시글 작성 성공");
    }

    // 커뮤니티 댓글 작성 API
    @ApiOperation({
        summary: "커뮤니티 댓글 작성 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(WriteCommunityCommentResponseDto)
    @Post("/:communityBoardId/comments")
    async writeComment(
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint,
        @Req() req: AuthenticatedRequest,
        @Body() body: WriteCommunityCommentRequestDto,
    ): Promise<CustomResponse<WriteCommunityCommentResponseDto>> {
        const member = req.member;
        const data: WriteCommunityCommentResponseDto = await this.communityService.writeComment(communityBoardId, member, body);

        return new CustomResponse<WriteCommunityCommentResponseDto>(data, "커뮤니티 댓글 작성 성공");
    }

    @ApiOperation({
        summary: "커뮤니티 게시글 좋아요 토글 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(LikeCommunityResponseDto)
    @Post("/:communityBoardId/like")
    async toggleLike(
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint,
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<LikeCommunityResponseDto>> {
        const member = req.member;
        const data = await this.communityService.toggleLike(communityBoardId, member);

        return new CustomResponse<LikeCommunityResponseDto>(data, "좋아요 상태 변경");
    }

    // 커뮤니티 전체 조회 API
    @ApiOperation({
        summary: "커뮤니티 전체 조회 API",
    })
    @ApiCustomResponseDecorator(GetAllCommunityBoardResponseDto)
    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    async getAllCommunity(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetAllCommunityBoardResponseDto[]>> {
        const member = req.member;
        const data = await this.communityService.getAllCommunity(member);

        return new CustomResponse<GetAllCommunityBoardResponseDto[]>(data, "커뮤니티 게시글 전체 조회 성공");
    }

    // 커뮤니티 상세 조회 API
    @ApiOperation({
        summary: "커뮤니티 상세 조회 API",
    })
    @ApiCustomResponseDecorator(GetCommunityBoardDetailResponseDto)
    @UseGuards(OptionalJwtAuthGuard)
    @Get("/:communityBoardId")
    async getCommunityDetail(
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint,
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<GetCommunityBoardDetailResponseDto>> {
        const member = req.member;
        const data = await this.communityService.getCommunityDetail(communityBoardId, member);

        return new CustomResponse<GetCommunityBoardDetailResponseDto>(data, "커뮤니티 게시글 상세 조회 성공");
    }

    // 커뮤니티 댓글 전체 조회 API
    @ApiOperation({
        summary: "커뮤니티 댓글 전체 조회 API",
    })
    @ApiCustomResponseDecorator(GetAllCommunityCommentResponseDto)
    @UseGuards(OptionalJwtAuthGuard)
    @Get("/:communityBoardId/comments")
    async getAllComments(
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint): Promise<CustomResponse<GetAllCommunityCommentResponseDto[]>> {
        const data = await this.communityService.getAllComments(communityBoardId);

        return new CustomResponse<GetAllCommunityCommentResponseDto[]>(data, "커뮤니티 댓글 전체 조회 성공");
    }

    // 커뮤니티 수정 API
    @ApiOperation({
        summary: "커뮤니티 수정 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(UpdateCommunityBoardResponseDto)
    @Patch("/:communityBoardId")
    async updateBoard(
        @Req() req: AuthenticatedRequest,
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint,
        @Body() body: UpdateCommunityBoardRequestDto,
    ): Promise<CustomResponse<UpdateCommunityBoardResponseDto>> {
        const memberId = BigInt(req.member.id);
        const updateBoard = await this.communityService.updateCommunity(communityBoardId, memberId, body);

        return new CustomResponse<UpdateCommunityBoardResponseDto>(updateBoard, "커뮤니티 게시글 수정 성공");
    }

    // 커뮤니티 삭제 API
    @ApiOperation({
        summary: "커뮤니티 삭제 API",
    })
    @UseGuards(JwtAuthGuard)
    @Delete("/:communityBoardId")
    async deleteCommunity(
        @Param("communityBoardId", ParseBigIntPipe) communityBoardId: bigint,
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<void>> {
        const member = req.member;
        await this.communityService.deleteCommunity(communityBoardId, member);

        return new CustomResponse<void>(undefined, "커뮤니티 게시글 삭제 성공");
    }

    // 커뮤니티 댓글 삭제 API
    @ApiOperation({
        summary: "커뮤니티 댓글 삭제 API",
    })
    @UseGuards(JwtAuthGuard)
    @Delete("/:commentId/comments")
    async deleteComment(
        @Param("commentId", ParseBigIntPipe) commentId: bigint,
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<void>> {
        const member = req.member;
        await this.communityService.deleteComment(commentId, member);

        return new CustomResponse<void>(undefined, "커뮤니티 댓글 삭제 성공");
    }
};
