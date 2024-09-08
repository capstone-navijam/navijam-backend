import {
    getTimestamp,
} from "@main/util/timestamp.util";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console-response.dto";
import {
    GetComfortAndConsolesResponseDto,
} from "@main/comfort/dto/res/get-comfort-console.response.dto";
import {
    Category,
} from "@main/global/category";

export function mapToComfortAndConsolesDto(board: any, consoles: any[]): GetComfortAndConsolesResponseDto {
    // 콘솔(위로하기 답글) 변환 처리
    const consolesDto = consoles.map(console => {
        const timestamp = getTimestamp(console.createdAt, console.updatedAt);

        return new GetAllConsoleResponseDto(
            console.id.toString(), console.member.nickname, console.member.profile, console.content, timestamp, console.memberId.toString()
        );
    });

    // 게시글에 대한 카테고리 변환 처리
    const categories = board.categories.map((category: any) => category as Category);

    // 최종적으로 게시글과 답글을 결합한 DTO 반환
    return new GetComfortAndConsolesResponseDto(
        board.id.toString(), categories, board.title, board.content, board.memberId.toString(), board.member.profile, board.member.nickname, board.createdAt.toISOString(), board.isAnswered, consolesDto
    );
}