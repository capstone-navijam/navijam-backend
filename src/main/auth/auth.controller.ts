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

@ApiTags("일반 사용자 회원가입")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("/signup")
    @ApiCreatedResponse({
        description: "회원가입이 성공적으로 처리되었습니다.",
        type: SignUpResponseDto,
    })
    async signup(@Body(CheckPasswordPipe) body: SignupRequestDto): Promise<CustomResponse<SignUpResponseDto>> {
        const data: SignUpResponseDto = await this.authService.signup(body);

        return new CustomResponse<SignUpResponseDto>(data);
    }
}
