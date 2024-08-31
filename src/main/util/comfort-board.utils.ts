import {
    GetAnsweredComfortBoardResponseDto,
} from "@main/comfort/dto/res/get-answered-comfort-board.response.dto";
import {
    prismaCategoryToCategory,
} from "@main/global/category";

export function filterUniqueComfortBoards(consoles: any[]): GetAnsweredComfortBoardResponseDto[] {
    const uniqueComfortsBoards = new Map<string, GetAnsweredComfortBoardResponseDto>();

    consoles.forEach(console => {
        if (console.comfort.isAnswered) {
            const categories = console.comfort.categories.map(prismaCategoryToCategory);
            const response = new GetAnsweredComfortBoardResponseDto(
                console.comfort.id.toString(), categories, console.comfort.title, console.comfort.createdAt
            );

            uniqueComfortsBoards.set(console.comfort.id.toString(), response);

        }
    });

    return Array.from(uniqueComfortsBoards.values());
}