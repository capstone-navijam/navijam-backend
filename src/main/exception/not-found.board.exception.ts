import {
    NotFoundException,
} from "@nestjs/common";

export default class NotFoundBoardException extends NotFoundException {
    constructor() {
        super({
            message: "게시글을 찾을 수 없습니다.",
        });
    }
}