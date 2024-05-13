import {
    Injectable,
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

type ExistsMember = Member | null;

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaClient) {
    }

    async signup(signupRequestDto: SignupRequestDto): Promise<SignUpResponseDto> {
        // 이메일 중복 확인
        const memberByEmail: ExistsMember = await this.prisma.member.findUnique({
            where: {
                email: signupRequestDto.email,
            },
        });

        if (memberByEmail) {
            throw new DuplicateEmailException();
        }

        // 닉네임 중복 확인
        const memberByNickname: ExistsMember = await this.prisma.member.findUnique({
            where: {
                nickname: signupRequestDto.nickname,
            },
        });
        if (memberByNickname) {
            throw new DuplicateNicknameException();
        }

        // 회원 생성
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
}