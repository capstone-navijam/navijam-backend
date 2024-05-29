import {
    Injectable, UnauthorizedException,
} from "@nestjs/common";
import {
    Member,
    PrismaClient,
} from "@prisma/client";
import {
    SignupRequestDto,
} from "@main/auth/dto/req/signup.request.dto";
import * as bcrypt from "bcrypt";
import {
    SignUpResponseDto,
} from "@main/auth/dto/res/signup.respnose.dto";
import {
    DuplicateEmailException,
} from "@main/exception/duplicate-email.exception";
import {
    DuplicateNicknameException,
} from "@main/exception/duplicate-nickname.exception";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    LoginRequestDto,
} from "@main/auth/dto/req/login.request.dto";
import {
    LoginResponseDto,
} from "@main/auth/dto/res/login.response.dto";
import {
    ConfigService,
} from "@nestjs/config";
import {
    InvalidPasswordException,
} from "@main/exception/invalid-password.exception";

type ExistsMember = Member | null;

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaClient,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    // 회원가입
    async signup(signupRequestDto: SignupRequestDto): Promise<SignUpResponseDto> {
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: signupRequestDto.email,
            },
        });

        if (memberByEmail) {
            throw new DuplicateEmailException();
        }

        const memberByNickname: ExistsMember = await this.prisma.member.findUnique({
            where: {
                nickname: signupRequestDto.nickname,
            },
        });
        if (memberByNickname) {
            throw new DuplicateNicknameException();
        }

        const member: Member = await this.prisma.member.create({
            data: {
                email: signupRequestDto.email,
                nickname: signupRequestDto.nickname,
                password: await bcrypt.hash(signupRequestDto.password, 10),
                profile: signupRequestDto.profile,
            },
        });

        return new SignUpResponseDto(member.id.toString());
    }

    // 로그인
    async login(loginRequestDto: LoginRequestDto):Promise<LoginResponseDto> {
        const member = await this.prisma.member.findUnique({
            where: {
                email: loginRequestDto.email,
            },
        });

        if (!member || !(await bcrypt.compare(loginRequestDto.password, member.password)))
            throw new InvalidPasswordException();

        const payload = {
            sub: member.id.toString(),
            role: member.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return {
            nickname: member.nickname,
            profile: member.profile,
            role: member.role,
            accessToken,
            tokenType: "Bearer",
        };

    }
}