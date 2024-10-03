import {
    NotFoundException,
} from "@nestjs/common";

export default class NotFoundCommentException extends NotFoundException {
    constructor() {
        super({
            message: "댓글을 찾을 수 없습니다.",
        });
    }
}