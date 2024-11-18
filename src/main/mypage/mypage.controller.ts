import {
    Body,
    Controller, Patch, Req, UseFilters, UseGuards,
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

@Controller("mypage")
@UseGuards(JwtAuthGuard)
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class MypageController {
    constructor(private readonly mypageService: MypageService) {
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
}