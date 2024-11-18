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
    ApiOperation,
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

@Controller("mypage")
@UseGuards(JwtAuthGuard)
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class MypageController {
    constructor(private readonly mypageService: MypageService) {
    }

    @ApiOperation({
        summary: "마이페이지 첫번째 페이지 조회",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(GetMemberProfileResponseDto)
    @Roles("MEMBER")
    @Get("/profile")
    async getMemberProfile(
        @Req() req: AuthenticatedRequest
    ): Promise<CustomResponse<GetMemberProfileResponseDto>> {
        const memberId = req.member.id;
        const data = await this.mypageService.getMemberProfile(memberId);

        return new CustomResponse<GetMemberProfileResponseDto>(data, "마이페이지 프로필 조회 성공");
    }

    @ApiOperation({
        summary: "마이페이지 프로필 수정(닉네임, 비밀번호)",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(UpdateMemberProfileResponseDto)
    @Roles("MEMBER")
    @Patch("/profile")
    async updateMemberProfile(@Req() req: AuthenticatedRequest, @Body() body: UpdateMemberProfileRequestDto): Promise<CustomResponse<UpdateMemberProfileResponseDto>> {
        const memberId = req.member.id;
        const data = await this.mypageService.updateMemberProfile(memberId, body);

        return new CustomResponse<UpdateMemberProfileResponseDto>(data, "마이페이지 수정 성공");
    }

    @ApiOperation({
        summary: "마이페이지 프로필 수정(프로필 사진)",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Roles("MEMBER")
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
        await this.mypageService.updateMemberProfileImage(req.member.id, file);

    }
}