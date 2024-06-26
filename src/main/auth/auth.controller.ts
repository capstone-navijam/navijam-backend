import {
    Body, Controller, Get, HttpCode, HttpStatus, Post, Query,
} from "@nestjs/common";
import {
    AuthService,
} from "@main/auth/auth.service";
import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    SignupMemberRequestDto,
} from "@main/auth/dto/req/signup-member.request.dto";
import {
    SignupMemberResponseDto,
} from "@main/auth/dto/res/signup-member.response.dto";
import CustomResponse from "@main/response/custom-response";
import CheckPasswordPipe from "@main/auth/pipe/check-password.pipe";
import {
    LoginRequestDto,
} from "@main/auth/dto/req/login.request.dto";
import {
    LoginResponseDto,
} from "@main/auth/dto/res/login.response.dto";
import {
    SignupListenerRequestDto,
} from "@main/auth/dto/req/signup-listener.request.dto";
import {
    SignupListenerResponseDto,
} from "@main/auth/dto/res/signup-listener.response.dto";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import CheckDuplicateNicknameResponseDto from "@main/auth/dto/res/check-duplicate-nickname.response.dto";
import CheckDuplicateNicknameParamsDto from "@main/auth/dto/req/check-duplicate-nickname.params.dto";
import CheckDuplicateEmailResponseDto from "@main/auth/dto/res/check-duplicate-email.response.dto";
import CheckDuplicateEmailParamsDto from "@main/auth/dto/req/check-duplicate-email.params.dto";

@ApiTags("인증 관련 로직")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/members")
    @ApiOperation({
        summary: "일반 회원가입 API",
    })
    @ApiCustomResponseDecorator(SignupMemberResponseDto)
    async signupMember(@Body(CheckPasswordPipe) body: SignupMemberRequestDto): Promise<CustomResponse<SignupMemberResponseDto>> {
        const data: SignupMemberResponseDto = await this.authService.signupMember(body);

        return new CustomResponse<SignupMemberResponseDto>(data,"회원가입 성공");
    }

    @Post("/listeners")
    @ApiOperation({
        summary: "상담사 회원가입 API",
    })
    @ApiCustomResponseDecorator(SignupListenerResponseDto)

    async signupListener(
        @Body(CheckPasswordPipe) body: SignupListenerRequestDto
    ): Promise<CustomResponse<SignupListenerResponseDto>> {
        const data: SignupListenerResponseDto = await this.authService.signupListener(body);

        return new CustomResponse<SignupListenerResponseDto>(data, "회원가입 성공");
    }

    @Post("login")
    @ApiOperation({
        summary: "로그인 API",
    })
    @HttpCode(HttpStatus.OK)
    @ApiCustomResponseDecorator(LoginResponseDto)
    async login(@Body() loginRequestDto: LoginRequestDto): Promise<CustomResponse<LoginResponseDto>> {
        const data: LoginResponseDto = await this.authService.login(loginRequestDto);

        return new CustomResponse<LoginResponseDto>(
            data, "로그인 성공",
        );
    }
<<<<<<< HEAD
}
=======

    // 닉네임 중복 확인 API
    @ApiOperation({
        summary: "닉네임 중복 확인 API",
        description: "닉네임 중복을 확인해주는 API를 구현한다.",
    })
    @ApiCustomResponseDecorator(CheckDuplicateNicknameResponseDto)
    @Get("/nicknames")
    async checkDuplicateNickname(@Query() params: CheckDuplicateNicknameParamsDto) {
        const data = await this.authService.checkDuplicateNickname(params);

        return new CustomResponse<CheckDuplicateNicknameResponseDto>(
            data, "닉네임 중복 확인 성공",
        );
    }

    // 이메일 중복 확인 API
    @ApiOperation({
        summary: "이메일 중복 확인 API",
        description: "이메일 중복을 확인해주는 API를 구현한다.",
    })
    @ApiCustomResponseDecorator(CheckDuplicateEmailResponseDto)
    @Get("/emails")
    async checkDuplicateEmail(@Query() params: CheckDuplicateEmailParamsDto) {
        const data = await this.authService.checkDuplicateEmail(params);

        return new CustomResponse<CheckDuplicateEmailResponseDto>(
            data, "이메일 중복 확인 성공"
        );
    }
}
>>>>>>> main
