import {
    Injectable,
} from "@nestjs/common";
import {
    ListenerInfo,
    Member,
    PrismaClient,
    Category, Role,
} from "@prisma/client";
import {
    SignupMemberRequestDto,
} from "@main/auth/dto/req/signup-member.request.dto";
import * as bcrypt from "bcrypt";
import {
    SignupMemberResponseDto,
} from "@main/auth/dto/res/signup-member.response.dto";
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
import {
    SignupListenerRequestDto,
} from "@main/auth/dto/req/signup-listener.request.dto";
import {
    SignupListenerResponseDto,
} from "@main/auth/dto/res/signup-listener.response.dto";

type ExistsMember = Member | null;
type ExistsListener = Member | null;

const categoryMap: { [key: string]: Category } = {
    "자유": Category.FREE,
    "육아": Category.PARENTING,
    "진로": Category.CAREER,
    "결혼": Category.MARRIAGE,
    "외모": Category.APPEARANCE,
    "인간관계": Category.RELATIONSHIPS,
    "중독": Category.ADDICTION,
    "이별": Category.BREAKUP,
    "가족": Category.FAMILY,
    "친구": Category.FRIEND,
    "건강": Category.HEALTH,
    "정신건강": Category.MENTAL_HEALTH,
};

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaClient,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    // 일반 회원가입
    async signupMember(signupMemberRequestDto: SignupMemberRequestDto): Promise<SignupMemberResponseDto> {
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: signupMemberRequestDto.email,
            },
        });

        if (memberByEmail) {
            throw new DuplicateEmailException();
        }

        const memberByNickname: ExistsMember = await this.prisma.member.findFirst({
            where: {
                nickname: signupMemberRequestDto.nickname,
            },
        });
        if (memberByNickname) {
            throw new DuplicateNicknameException();
        }

        const member: Member = await this.prisma.member.create({
            data: {
                email: signupMemberRequestDto.email,
                nickname: signupMemberRequestDto.nickname,
                password: await bcrypt.hash(signupMemberRequestDto.password, 10),
                profile: signupMemberRequestDto.profile,
            },
        });

        return new SignupMemberResponseDto(member.id.toString());
    }

    // 상담사 회원가입
    async signupListener(signupListenerRequestDto: SignupListenerRequestDto): Promise<SignupListenerResponseDto> {
        const listenerByEmail: ExistsListener = await this.prisma.member.findUnique({
            where: {
                email: signupListenerRequestDto.email,
            },
        });
        if (listenerByEmail) {
            throw new DuplicateEmailException();
        }

        const listenerInfo: ListenerInfo = await this.prisma.listenerInfo.create({
            data: {
                phoneNumber: signupListenerRequestDto.phoneNumber,
                address: signupListenerRequestDto.address,
                career: signupListenerRequestDto.career,
                description: signupListenerRequestDto.description,
                category: signupListenerRequestDto.category.map(category => categoryMap[category.toString()]),
            },
        });

        const listener: Member = await this.prisma.member.create({
            data: {
                email: signupListenerRequestDto.email,
                password: await bcrypt.hash(signupListenerRequestDto.password, 10),
                profile: signupListenerRequestDto.profile,
                nickname: signupListenerRequestDto.nickname + Math.random(),
                role: Role.LISTENER,
                listenerInfoId: listenerInfo.id,
            },
        });

        return new SignupListenerResponseDto(listener.id.toString());
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