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

@Injectable()
export class MypageService {
    constructor(private readonly prisma: PrismaClient) {
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
}
