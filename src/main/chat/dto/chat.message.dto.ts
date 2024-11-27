import {
    ApiProperty,
} from "@nestjs/swagger";

export class ChatMessageDto {
    @ApiProperty({
        description: "메시지 내용",
        example: "안녕하세요!",
    })
    readonly message: string;

    @ApiProperty({
        description: "작성 시간",
        example: "2024-11-27T14:32:00Z",
    })
    readonly createdAt: string;

    @ApiProperty({
        description: "발신자 ID",
        example: "1",
    })
    readonly senderId: string;

    constructor(message: string, createdAt: Date, senderId: bigint) {
        this.message = message;
        this.createdAt = createdAt.toISOString();
        this.senderId = senderId.toString();
    }
}