import {
    Injectable, UnauthorizedException,
} from "@nestjs/common";
import {
    ListenerInfo, Member, PrismaClient, Role,
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
import {
    categoryMap,
} from "@main/global/category";
import CheckDuplicateNicknameParamsDto from "@main/auth/dto/req/check-duplicate-nickname.params.dto";
import CheckDuplicateNicknameResponseDto from "@main/auth/dto/res/check-duplicate-nickname.response.dto";
import CheckDuplicateEmailParamsDto from "@main/auth/dto/req/check-duplicate-email.params.dto";
import CheckDuplicateEmailResponseDto from "@main/auth/dto/res/check-duplicate-email.response.dto";
import NotFoundMemberException from "@main/exception/not-found.member.exception";

type ExistsMember = Member | null;
type ExistsListener = Member | null;

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaClient,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService) {
    }

    // 토큰
    async validateMember(payload: any): Promise<Member | null> {
        const memberId = payload.sub;

        if (!memberId) {
            console.error("Invalid token payload: missing sub");
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
        });

        if (!member) {
            console.error(`No member found with ID: ${memberId}`);
            throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
        }

        return member;
    }

    // 암호 해싱
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(password, salt);
    }

    // 일반 회원가입
    async signupMember(body: SignupMemberRequestDto): Promise<SignupMemberResponseDto> {

        if (body.password !== body.checkPassword) {
            throw new InvalidPasswordException;
        }

        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: body.email,
            },
        });

        if (memberByEmail) {
            throw new DuplicateEmailException();
        }

        const memberByNickname: ExistsMember = await this.prisma.member.findFirst({
            where: {
                nickname: body.nickname,
            },
        });
        if (memberByNickname) {
            throw new DuplicateNicknameException();
        }

        const defaultProfile = this.configService.get<string>(
            "DEFAULT_PROFILE_URL",
        );

        const member = await this.prisma.member.create({
            data: {
                email: body.email,
                nickname: body.nickname,
                password: await this.hashPassword(body.password),
                profile: body.profile || defaultProfile as string,
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

        const prismaCategories = signupListenerRequestDto.category.map(category => categoryMap[category]);

        const listenerInfo: ListenerInfo = await this.prisma.listenerInfo.create({
            data: {
                phoneNumber: signupListenerRequestDto.phoneNumber,
                contactNumber: signupListenerRequestDto.contactNumber,
                address: signupListenerRequestDto.address,
                career: signupListenerRequestDto.career,
                education: signupListenerRequestDto.education,
                description: signupListenerRequestDto.description,
                categories: prismaCategories,
                availableTime: signupListenerRequestDto.availableTime,
                price: signupListenerRequestDto.price,
            },
        });

        const listener: Member = await this.prisma.member.create({
            data: {
                email: signupListenerRequestDto.email,
                password: await bcrypt.hash(signupListenerRequestDto.password, 10),
                profile: signupListenerRequestDto.profile,
                nickname: signupListenerRequestDto.nickname,
                role: Role.LISTENER,
                listenerInfoId: listenerInfo.id,
            },
        });

        return new SignupListenerResponseDto(listener.id.toString());
    }

    // 로그인
    async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
        const member: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: loginRequestDto.email,
            },
        });

        if (!member) {
            throw new NotFoundMemberException();
        }

        const isPasswordValid = await bcrypt.compare(loginRequestDto.password, member.password);
        if (!isPasswordValid) {
            throw new InvalidPasswordException();
        }

        const payload = {
            sub: member.id.toString(),
            role: member.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return new LoginResponseDto(
            member.id.toString(), member.nickname, member.role, member.profile, accessToken, "Bearer"
        );
    }

    // 닉네임 중복 확인
    async checkDuplicateNickname(
        paramsDto: CheckDuplicateNicknameParamsDto
    ): Promise<CheckDuplicateNicknameResponseDto> {
        const memberByNickname: ExistsMember = await this.prisma.member.findFirst({
            where: {
                nickname: paramsDto.nickname,
            },
        });

        return new CheckDuplicateNicknameResponseDto(!!memberByNickname);
    }

    // 이메일 중복 확인
    async checkDuplicateEmail(
        paramsDto: CheckDuplicateEmailParamsDto
    ): Promise<CheckDuplicateEmailResponseDto> {
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: paramsDto.email,
            },
        });

        return new CheckDuplicateEmailResponseDto(!!memberByEmail);
    }
}