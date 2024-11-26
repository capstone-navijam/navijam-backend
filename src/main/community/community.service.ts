import {
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import {
    Member,
    PrismaClient,
} from "@prisma/client";
import {
    WriteCommunityBoardRequestDto,
} from "@main/community/dto/req/write-community-board.request.dto";
import {
    categoryMap, prismaCategoryToCategory,
} from "@main/global/category";
import {
    WriteCommunityBoardResponseDto,
} from "@main/community/dto/res/write-community-board.response.dto";
import {
    GetCommunityBoardDetailResponseDto,
} from "@main/community/dto/res/get-community-board-detail.response.dto";
import NotFoundBoardException from "@main/exception/not-found.board.exception";
import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    GetAllCommunityBoardResponseDto,
} from "@main/community/dto/res/get-all-community-board.response.dto";
import {
    UpdateCommunityBoardRequestDto,
} from "@main/community/dto/req/update-community-board.request.dto";
import {
    UpdateCommunityBoardResponseDto,
} from "@main/community/dto/res/update-community-board.response.dto";
import {
    WriteCommunityCommentRequestDto,
} from "@main/community/dto/req/write-community-comment.request.dto";
import {
    WriteCommunityCommentResponseDto,
} from "@main/community/dto/res/write-community-comment.response.dto";
import {
    GetAllCommunityCommentResponseDto,
} from "@main/community/dto/res/get-all-community-comment.response.dto";
import NotFoundCommentException from "@main/exception/not-found.comment.exception";
import {
    LikeCommunityResponseDto,
} from "@main/community/dto/res/like-community-response.dto";

@Injectable()
export class CommunityService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 커뮤니티 글 작성
    async writeCommunity(member: Member, body: WriteCommunityBoardRequestDto): Promise<WriteCommunityBoardResponseDto> {

        const board = await this.prisma.communityBoard.create({
            data: {
                title: body.title,
                content: body.content,
                categories: body.category.map(category => categoryMap[category.toString()]),
                memberId: BigInt(member.id),
            },
        });

        return new WriteCommunityBoardResponseDto(board.id.toString());
    }

    // 커뮤니티 전체 조회
    async getAllCommunity(member: Member | null): Promise<GetAllCommunityBoardResponseDto[]> {
        const boards = await this.prisma.communityBoard.findMany({
            include: {
                member: true,
                likes: true,
                _count: {
                    select: {
                        communityComments: true,
                    },
                },
            },
        });

        return boards.map((board) => {
            const categories = board.categories.map(prismaCategoryToCategory);
            const timestamp = getTimestamp(board.createdAt, board.updatedAt, "date");

            const likeCount = board.likes.length;
            const liked = member ? board.likes.some(like => like.memberId === member.id) : false;
            const commentCount = board._count.communityComments;

            return new GetAllCommunityBoardResponseDto(
                board.id.toString(), board.member?.profile || "", board.member?.nickname || "", categories, board.title, board.content, board.memberId?.toString() || "", timestamp, liked, likeCount, commentCount,
            );
        });
    }

    // 커뮤니티 상세 조회
    async getCommunityDetail(communityBoardId: bigint, member: Member | null): Promise<GetCommunityBoardDetailResponseDto> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
            include: {
                member: true,
                likes: true,
                _count: {
                    select: {
                        communityComments: true,
                    },
                },
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const timestamp = getTimestamp(board.createdAt, board.updatedAt, "datetime");
        const categories = board.categories.map(prismaCategoryToCategory);

        const likeCount = board.likes.length;
        const liked = member ? board.likes.some(like => like.memberId === member.id) : false;
        const commentCount = board._count.communityComments;

        return new GetCommunityBoardDetailResponseDto(
            board.id.toString(), board.member?.profile || "", board.member?.nickname || "", categories, board.title, board.content, board.memberId?.toString() || "", timestamp, liked, likeCount, commentCount
        );
    }

    // 커뮤니티 수정
    async updateCommunity(communityBoardId: bigint, memberId: bigint, body: UpdateCommunityBoardRequestDto): Promise<UpdateCommunityBoardResponseDto> {
        const board = await this.prisma.communityBoard.findFirst({
            where: {
                id: communityBoardId,
                memberId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const updatedBoard = await this.prisma.communityBoard.update({
            where: {
                id: communityBoardId,
            },
            data: {
                title: body.title,
                content: body.content,
                updatedAt: new Date(),
            },
            include: {
                member: true,
            },
        });

        return new UpdateCommunityBoardResponseDto(updatedBoard.id.toString());
    }

    // 커뮤니티 게시글 삭제
    async deleteCommunity(communityBoardId: bigint, member: Member): Promise<void> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException();
        }

        if (board.memberId !== member.id) {
            throw new ForbiddenException;
        }

        await this.prisma.$transaction(async (prisma) => {
            await prisma.communityComment.deleteMany({
                where: {
                    id: communityBoardId,
                },
            });
            await prisma.communityBoard.delete({
                where: {
                    id: communityBoardId,
                },
            });
        });
    }

    // 커뮤니티 댓글 작성
    async writeComment(communityBoardId: bigint, member: Member, body: WriteCommunityCommentRequestDto): Promise<WriteCommunityCommentResponseDto> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const comment = await this.prisma.communityComment.create({
            data: {
                content: body.content,
                memberId: (member.id),
                postId: communityBoardId,
            },
        });

        return new WriteCommunityBoardResponseDto(comment.id.toString());
    }

    // 커뮤니티 댓글 조회
    async getAllComments(communityBoardId: bigint): Promise<GetAllCommunityCommentResponseDto[]> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const comments = await this.prisma.communityComment.findMany({
            where: {
                postId: communityBoardId,
            },
            include: {
                member: true,
            },
        });

        return comments.map(comment => {
            const timestamp = getTimestamp(board.createdAt, board.updatedAt, "datetime");

            return new GetAllCommunityCommentResponseDto(
                comment.id.toString(), comment.member?.nickname?.toString() || "", comment.member?.profile?.toString() || "", comment.content, timestamp, comment.member?.id?.toString() || "", communityBoardId.toString(),
            );
        });
    }

    // 커뮤니티 댓글 삭제
    async deleteComment(commentId: bigint, member: Member): Promise<void> {
        const comment = await this.prisma.communityComment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!comment) {
            throw new NotFoundCommentException;
        }

        if (comment.memberId === commentId) {
            throw new ForbiddenException;
        }

        await this.prisma.communityComment.delete({
            where: {
                id: commentId,
            },
        });
    }

    // 좋아요 토글
    async toggleLike(communityBoardId: bigint, member: Member): Promise<LikeCommunityResponseDto> {
        const board = await this.prisma.communityBoard.findUnique({
            where: {
                id: communityBoardId,
            },
        });

        if (!board) {
            throw new NotFoundBoardException;
        }

        const existingLike = await this.prisma.likes.findUnique({
            where: {
                memberId_communityId: {
                    memberId: member.id,
                    communityId: communityBoardId,
                },
            },
        });

        if (existingLike) {
            await this.prisma.likes.delete({
                where: {
                    memberId_communityId: {
                        memberId: member.id,
                        communityId: communityBoardId,
                    },
                },
            });
        } else {
            await this.prisma.likes.create({
                data: {
                    memberId: member.id,
                    communityId: communityBoardId,
                },
            });
        }

        const likeCount = await this.prisma.likes.count({
            where: {
                communityId: communityBoardId,
            },
        });

        return new LikeCommunityResponseDto(!existingLike, likeCount);
    }
}
