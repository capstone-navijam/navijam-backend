import {
    BadRequestException,
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import {
    UpdateMemberProfileRequestDto,
} from "@main/mypage/dto/req/update-member.profile.request.dto";
import {
    DuplicateNicknameException,
} from "@main/exception/duplicate-nickname.exception";
import {
    UpdateMemberProfileResponseDto,
} from "@main/mypage/dto/res/update-member-profile.response.dto";
import {
    FileService,
} from "@main/file/file.service";
import {
    UpdateMemberProfileImageResponseDto,
} from "@main/mypage/dto/res/update-member-profile-image.response.dto";
import {
    GetMemberProfileResponseDto,
} from "@main/mypage/dto/res/get-member-profile.response.dto";
import NotFoundMemberException from "@main/exception/not-found.member.exception";

@Injectable()
export class MypageService {
    constructor(private readonly prisma: PrismaClient, private readonly fileService: FileService) {
    }

    async updateMemberProfile(memberId: bigint, body: UpdateMemberProfileRequestDto): Promise<UpdateMemberProfileResponseDto> {
        const dataToUpdate: any = {};

        // 닉네임 처리
        if (body.nickname) {
            const nicknameExists = await this.prisma.member.findFirst({
                where: {
                    nickname: body.nickname,
                },
            });

            if (nicknameExists) {
                throw new DuplicateNicknameException;
            }

            dataToUpdate.nickname = body.nickname;
        }

        // 비밀번호 처리
        if (body.newPassword || body.checkPassword) {
            if (body.newPassword !== body.checkPassword) {
                throw new BadRequestException("비밀번호가 일치하지 않습니다.");
            }
            dataToUpdate.password = body.newPassword;
        }

        // 존재하는 필드만 업데이트 실행
        if (Object.keys(dataToUpdate).length > 0) {
            await this.prisma.member.update({
                where: {
                    id: memberId,
                },
                data: dataToUpdate,
            });
        }

        return new UpdateMemberProfileResponseDto(
            memberId.toString(),
        );
    }

    async updateMemberProfileImage(memberId: bigint, file: Express.Multer.File) {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
        });

        await this.fileService.delete(member!.profile);

        const newProfile: string = await this.fileService.upload(file);

        await this.prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                profile: newProfile,
            },
        });

        return new UpdateMemberProfileImageResponseDto(
            memberId.toString(),
        );
    }

    // 마이페이지 프로필 조회
    async getMemberProfile(memberId: bigint): Promise<GetMemberProfileResponseDto> {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
            select: {
                id: true,
                profile: true,
                email: true,
                nickname: true,
            },
        });

        if (!member) {
            throw new NotFoundMemberException;
        }

        return new GetMemberProfileResponseDto(
            member.id.toString(), member.profile, member.email, member.nickname
        );
    }
}
