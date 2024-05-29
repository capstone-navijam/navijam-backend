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
    SignupRequestDto,
} from "@main/auth/dto/req/signup.request.dto";
import {
    SignUpResponseDto,
} from "@main/auth/dto/res/signup.respnose.dto";
import CustomResponse from "@main/response/custom-response";
import CheckPasswordPipe from "@main/auth/pipe/check-password.pipe";
import {
    LoginRequestDto,
} from "@main/auth/dto/req/login.request.dto";
import {
    LoginResponseDto,
} from "@main/auth/dto/res/login.response.dto";

@ApiTags("인증 관련 로직")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/signup")
    @ApiCreatedResponse({
        description: "회원가입",
        type: SignUpResponseDto,
    })
    async signup(@Body(CheckPasswordPipe) body: SignupRequestDto): Promise<CustomResponse<SignUpResponseDto>> {
        const data: SignUpResponseDto = await this.authService.signup(body);

        return new CustomResponse<SignUpResponseDto>(data,"회원가입 성공");
    }

    @Post("login")
    async login(@Body() loginRequestDto: LoginRequestDto): Promise<CustomResponse<LoginResponseDto>> {
        const data: LoginResponseDto = await this.authService.login(loginRequestDto);

        return new CustomResponse<LoginResponseDto>(
            data, "로그인 성공",
        );
    }
}
