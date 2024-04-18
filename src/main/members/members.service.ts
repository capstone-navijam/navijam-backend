import {
    Injectable, UnauthorizedException,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import {
    CreateMemberDto,
} from "@main/members/dto/create-member.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class MembersService {
    constructor(private readonly prisma: PrismaClient) {
    }

    async create(createMemberDto: CreateMemberDto) {
        // 이메일 중복 확인
        const existingEmail = await this.prisma.member.findFirst({
            where: {
                email: createMemberDto.email,
            },
        });
        if (existingEmail) {
            throw new UnauthorizedException("이미 존재하는 이메일입니다.");
        }

        // 닉네임 중복 확인
        const existingNickname = await this.prisma.member.findFirst({
            where: {
                nickname: createMemberDto.nickname,
            },
        });
        if (existingNickname) {
            throw new UnauthorizedException("이미 존재하는 닉네임입니다.");
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(createMemberDto.password, 10);

        // 회원 생성
        return this.prisma.member.create({
            data: {
                email: createMemberDto.email,
                nickname: createMemberDto.nickname,
                password: hashedPassword,
                profile: createMemberDto.profile,
            },
        });
    }
}