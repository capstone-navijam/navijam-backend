import {
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import {
    ConfigService,
} from "@nestjs/config";
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
import {
    InvalidPasswordException,
} from "@main/exception/invalid-password.exception";
import {
    GetComfortBoardWithStatusResponseDto,
} from "@main/mypage/dto/res/get-comfort-board-with-status.response.dto";
import {
    GetMyCommunityBoardsResponseDto,
} from "@main/mypage/dto/res/get-my-community-boards.response.dto";
import {
    GetMyCommunityCommentsResponseDto,
} from "@main/mypage/dto/res/get-my-community-comments.response.dto";
import {
    UpdatePasswordResponseDto,
} from "@main/mypage/dto/res/update-password.response.dto";
import {
    UpdatePasswordRequestDto,
} from "@main/mypage/dto/req/update-password.request.dto";

@Injectable()
export class MypageService {
    constructor(private readonly prisma: PrismaClient,
                private readonly fileService: FileService,
                private readonly configService: ConfigService) {
    }

    // (회원) 마이페이지 프로필 닉네임 수정
    async updateMemberProfile(memberId: bigint, body: UpdateMemberProfileRequestDto): Promise<UpdateMemberProfileResponseDto> {
        const nicknameExists = await this.prisma.member.findFirst({
            where: {
                nickname: body.nickname,
            },
        });

        if (nicknameExists) {
            throw new DuplicateNicknameException;
        }

        await this.prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                nickname: body.nickname,
            },
        });

        return new UpdateMemberProfileResponseDto(
            memberId.toString(), body.nickname
        );
    }

    // 비밀번호 변경
    async updatePassword(memberId: bigint, body: UpdatePasswordRequestDto): Promise<UpdatePasswordResponseDto> {
        if (body.newPassword !== body.checkPassword) {
            throw new InvalidPasswordException;
        }

        const hashedPassword = await bcrypt.hash(body.newPassword, 10);

        await this.prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return new UpdatePasswordResponseDto(
            memberId.toString(),
        );
    }

    // 마이페이지 프로필 이미지 수정
    async updateMemberProfileImage(memberId: bigint, file: Express.Multer.File) {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
        });

        const defaultProfile = this.configService.get<string>(
            "DEFAULT_PROFILE_URL"
        );

        if (member!.profile !== defaultProfile) {
            await this.fileService.delete(member!.profile);
        }

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
            memberId.toString(), newProfile
        );
    }

    // (회원) 마이페이지 프로필 조회
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

    // (회원) 마이페이지 위로받기 상태 조회
    async getMemberComfortStatusWithAnswer(memberId: bigint): Promise<{
        answered: GetComfortBoardWithStatusResponseDto[];
        waiting: GetComfortBoardWithStatusResponseDto[]
    }> {
        const boards = await this.prisma.comfortBoard.findMany({
            where: {
                memberId: memberId,
            },
            include: {
                consoles: true,
            },
        });

        const answered = boards
            .filter((board) => board.consoles.length > 0)
            .map((board) =>
                new GetComfortBoardWithStatusResponseDto(
                    board.id.toString(), board.title, board.createdAt.toISOString(), true
                )
            );

        const waiting = boards
            .filter((board) => board.consoles.length === 0) // 답변이 없는 게시글
            .map((board) =>
                new GetComfortBoardWithStatusResponseDto(
                    board.id.toString(), board.title, board.createdAt.toISOString(), false // 답변 대기 상태
                )
            );

        return {
            answered,
            waiting,
        };
    };

    // 본인이 작성한 커뮤니티 게시글 조회
    async getMyCommunityBoards(memberId: bigint): Promise<GetMyCommunityBoardsResponseDto[]> {
        const boards = await this.prisma.communityBoard.findMany({
            where: {
                memberId: memberId,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
            },
        });

        return boards.map((board) =>
            new GetMyCommunityBoardsResponseDto(
                board.id.toString(), board.title, board.createdAt.toISOString()
            )
        );
    }

    // 본인이 작성한 커뮤니티 댓글 조회
    async getMyCommunityComments(memberId: bigint): Promise<GetMyCommunityCommentsResponseDto[]> {
        const comments = await this.prisma.communityComment.findMany({
            where: {
                memberId: memberId,
            },
            select: {
                content: true,
                createdAt: true,
                postId: true,
            },
        });

        return comments.map((comment) =>
            new GetMyCommunityCommentsResponseDto(
                comment.postId.toString(), comment.content, comment.createdAt.toISOString()
            ));
    };
}
