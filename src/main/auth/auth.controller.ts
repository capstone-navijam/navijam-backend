import {
    Body, Controller, Post,
} from "@nestjs/common";
import {
    AuthService,
} from "@main/auth/auth.service";
import {
    ApiCreatedResponse, ApiTags,
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

@ApiTags("인증 관련 로직")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/members")
    @ApiCreatedResponse({
        description: "일반 회원가입",
        type: SignupMemberResponseDto,
    })
    async signupMember(@Body(CheckPasswordPipe) body: SignupMemberRequestDto): Promise<CustomResponse<SignupMemberResponseDto>> {
        const data: SignupMemberResponseDto = await this.authService.signupMember(body);

        return new CustomResponse<SignupMemberResponseDto>(data,"회원가입 성공");
    }

    @Post("/listeners")
    @ApiCreatedResponse({
        description: "상담사 회원가입",
        type:SignupMemberResponseDto,
    })

    async signupListener(
        @Body(CheckPasswordPipe) body: SignupListenerRequestDto
    ): Promise<CustomResponse<SignupListenerResponseDto>> {
        const data: SignupListenerResponseDto = await this.authService.signupListener(body);

        return new CustomResponse<SignupListenerResponseDto>(data, "회원가입 성공");
    }

    @Post("login")
    async login(@Body() loginRequestDto: LoginRequestDto): Promise<CustomResponse<LoginResponseDto>> {
        const data: LoginResponseDto = await this.authService.login(loginRequestDto);

        return new CustomResponse<LoginResponseDto>(
            data, "로그인 성공",
        );
    }
}
