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
import {
    UpdateListenerProfileResponseDto,
} from "@main/mypage/dto/res/update-listener.profile.response.dto";
import {
    UpdateListenerProfileRequestDto,
} from "@main/mypage/dto/req/update-listener.profile.request.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";
import {
    categoryMap, prismaCategoryToCategory,
} from "@main/global/category";
import {
    GetListenerProfileResponseDto,
} from "@main/mypage/dto/res/get-listener-profile.response.dto";
import {
    GetWaitingComfortBoardResponseDto,
} from "@main/mypage/dto/res/get-waiting-comfort-board.response.dto";
import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    formatPriceToKRW,
} from "@main/util/format-price.utils";

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
                    board.id.toString(), board.title, board.createdAt.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }), true
                )
            );

        const waiting = boards
            .filter((board) => board.consoles.length === 0) // 답변이 없는 게시글
            .map((board) =>
                new GetComfortBoardWithStatusResponseDto(
                    board.id.toString(), board.title, board.createdAt.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }), false
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
                comment.postId.toString(), comment.content, comment.createdAt.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }),
            ));
    };

    // 상담사 프로필 수정
    async updateListenerProfile(memberId: bigint, body: UpdateListenerProfileRequestDto): Promise<UpdateListenerProfileResponseDto> {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
            include: {
                listenerInfo: true,
            },
        });

        if (!member || !member.listenerInfo) {
            throw new NotFoundListenerException;
        }

        if (body.nickname) {
            await this.prisma.member.update({
                where: {
                    id: memberId,
                },
                data: {
                    nickname: body.nickname,
                },
            });
        }

        const prismaCategories = body.category.map(category => categoryMap[category]);

        const updatedListenerInfo = await this.prisma.listenerInfo.update({
            where: {
                id: member.listenerInfo.id,
            },
            data: {
                address: body.address,
                career: body.career,
                education: body.education,
                description: body.description,
                phoneNumber: body.phoneNumber,
                contactNumber: body.contactNumber,
                categories: prismaCategories,
                availableTime: body.availableTime,
            },
        });

        const profileCategories = updatedListenerInfo.categories.map(prismaCategoryToCategory);
        const formattedPrice = formatPriceToKRW(updatedListenerInfo.price || 0);

        return new UpdateListenerProfileResponseDto(
            body.nickname ?? member.nickname, updatedListenerInfo.address || "", updatedListenerInfo.career, updatedListenerInfo.education, updatedListenerInfo.description, updatedListenerInfo.phoneNumber || "", updatedListenerInfo.contactNumber, profileCategories, updatedListenerInfo.availableTime, member.email, formattedPrice,
        );
    }

    // 상담사 프로필 조회
    async getListenerProfile(memberId: bigint): Promise<GetListenerProfileResponseDto> {
        const member = await this.prisma.member.findUnique({
            where: {
                id: memberId,
            },
            include: {
                listenerInfo: true,
            },
        });

        if (!member || !member.listenerInfo) {
            throw new NotFoundListenerException;
        }

        const listenerInfo = member.listenerInfo;

        const categories = listenerInfo.categories.map(prismaCategoryToCategory);
        const formattedPrice = formatPriceToKRW(listenerInfo.price || 0);

        return new GetListenerProfileResponseDto(
            member.id.toString(), member.profile, member.nickname, listenerInfo.address || "", listenerInfo.career || [], listenerInfo.education || [], listenerInfo.description || "", listenerInfo.phoneNumber || "", listenerInfo.contactNumber || "", categories, listenerInfo.availableTime || [], member.email, formattedPrice
        );
    }

    // 답변 대기 중인 위로받기 게시글 조회
    async getWaitingComfortBoards(): Promise<GetWaitingComfortBoardResponseDto[]> {
        const comfortBoards = await this.prisma.comfortBoard.findMany({
            where: {
                consoles: {
                    none: {},
                },
            },
            include: {
                member: true,
            },
        });

        return comfortBoards.map(comfort => {
            const categories = comfort.categories.map(prismaCategoryToCategory);

            const timestamp = getTimestamp(comfort.createdAt, undefined, "date");

            return new GetWaitingComfortBoardResponseDto(
                comfort.id.toString(), categories, comfort.title, timestamp,
            );
        });
    }
}
