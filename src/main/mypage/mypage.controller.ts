import {
    Body,
    Controller, FileTypeValidator, Get, ParseFilePipe, Patch, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors,
} from "@nestjs/common";
import {
    MypageService,
} from "@main/mypage/mypage.service";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    UpdateMemberProfileRequestDto,
} from "@main/mypage/dto/req/update-member.profile.request.dto";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    UpdateMemberProfileResponseDto,
} from "@main/mypage/dto/res/update-member-profile.response.dto";
import CustomResponse from "@main/response/custom-response";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    FileInterceptor,
} from "@nestjs/platform-express";
import {
    GetMemberProfileResponseDto,
} from "@main/mypage/dto/res/get-member-profile.response.dto";
import {
    GetComfortBoardWithStatusResponseDto,
} from "@main/mypage/dto/res/get-comfort-board-with-status.response.dto";
import {
    GetCommunityBoardDetailResponseDto,
} from "@main/community/dto/res/get-community-board-detail.response.dto";
import {
    GetMyCommunityBoardsResponseDto,
} from "@main/mypage/dto/res/get-my-community-boards.response.dto";
import {
    GetMyCommunityCommentsResponseDto,
} from "@main/mypage/dto/res/get-my-community-comments.response.dto";
import {
    UpdatePasswordResponseDto,
} from "@main/mypage/dto/res/update-password.response.dto";
import {
    UpdatePasswordRequestDto,
} from "@main/mypage/dto/req/update-password.request.dto";
import {
    UpdateMemberProfileImageResponseDto,
} from "@main/mypage/dto/res/update-member-profile-image.response.dto";

@ApiTags("마이페이지")
@Controller("/mypage")
@UseGuards(JwtAuthGuard)
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class MypageController {
    constructor(private readonly mypageService: MypageService) {
    }

    @ApiOperation({
        summary: "(회원) 마이페이지 첫 번째 페이지 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(GetMemberProfileResponseDto)
    @Roles("MEMBER")
    @Get("/profile")
    async getMemberProfile(
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<GetMemberProfileResponseDto>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.getMemberProfile(memberId);

        return new CustomResponse<GetMemberProfileResponseDto>(data, "마이페이지 프로필 조회 성공");
    }

    @ApiOperation({
        summary: "(회원) 마이페이지 두 번째 페이지 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(GetComfortBoardWithStatusResponseDto)
    @Roles("MEMBER")
    @Get("/comforts")
    async getMemberComfortStatusWithAnswer(
        @Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<GetComfortBoardWithStatusResponseDto[]>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.getMemberComfortStatusWithAnswer(memberId);

        return new CustomResponse<GetComfortBoardWithStatusResponseDto[]>([...data.answered,
            ...data.waiting,], "마이페이지 위로받기 상태 조회 성공");
    };

    @ApiOperation({
        summary: "마이페이지 세 번째 페이지 조회(본인이 작성한 커뮤니티 게시글) API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(GetCommunityBoardDetailResponseDto)
    @Get("/community")
    async getMyCommunityBoard(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetMyCommunityBoardsResponseDto[]>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.getMyCommunityBoards(memberId);

        return new CustomResponse<GetMyCommunityBoardsResponseDto[]>(data, "마이페이지 커뮤니티 게시글 조회 성공");
    }

    @ApiOperation({
        summary: "마이페이지 세 번째 페이지 조회(본인이 작성한 커뮤니티 댓글) API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(GetMyCommunityCommentsResponseDto)
    @Get("/community/comments")
    async getMyCommunityComments(@Req() req: AuthenticatedRequest): Promise<CustomResponse<GetMyCommunityCommentsResponseDto[]>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.getMyCommunityComments(memberId);

        return new CustomResponse<GetMyCommunityCommentsResponseDto[]>(data, "마이페이지 커뮤니티 게시글 댓글 조회 성공");

    }

    @ApiOperation({
        summary: "(회원) 마이페이지 프로필 수정(닉네임) API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(UpdateMemberProfileResponseDto)
    @Roles("MEMBER")
    @Patch("/profile")
    async updateMemberProfile(@Req() req: AuthenticatedRequest, @Body() body: UpdateMemberProfileRequestDto): Promise<CustomResponse<UpdateMemberProfileResponseDto>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.updateMemberProfile(memberId, body);

        return new CustomResponse<UpdateMemberProfileResponseDto>(data, "마이페이지 수정 성공");
    }

    @ApiOperation({
        summary: "비밀번호 변경 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(UpdatePasswordResponseDto)
    @Patch("/profile/password")
    async updatePassword(
        @Req() req: AuthenticatedRequest,
        @Body() body: UpdatePasswordRequestDto
    ): Promise<CustomResponse<UpdatePasswordResponseDto>> {
        const memberId = BigInt(req.member.id);
        const data = await this.mypageService.updatePassword(memberId, body);

        return new CustomResponse<UpdatePasswordResponseDto>(data, "비밀번호 변경 성공");
    }

    @ApiOperation({
        summary: "마이페이지 프로필 수정(프로필 사진) API",
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Patch("/profile/image")
    async updateMemberProfileImage(@Req() req: AuthenticatedRequest,
                                   @UploadedFile(
                                       new ParseFilePipe({
                                           validators: [
                                               new FileTypeValidator({
                                                   fileType: /image\/(png|jpeg|gif)$/,
                                               }),
                                           ],
                                       })
                                   ) file: Express.Multer.File) {
        const data = await this.mypageService.updateMemberProfileImage(req.member.id, file);

        return new CustomResponse<UpdateMemberProfileImageResponseDto>(data, "프로필 사진 수정 성공");

    }
}