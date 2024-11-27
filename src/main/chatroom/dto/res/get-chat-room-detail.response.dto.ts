import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    ChatMessageDto,
} from "@main/chat/dto/chat.message.dto";

export class GetChatroomDetailResponseDto {
    @ApiProperty({
        description: "채팅방 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "상대방 닉네임",
        example: "이춘식",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "상대방 프로필 이미지",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "채팅 메시지 목록",
        type: [ChatMessageDto,],
    })
    readonly messages: ChatMessageDto[];

    @ApiProperty({
        description: "채팅방 활성 상태",
        example: true,
    })
    readonly isEnabled: boolean;

    @ApiProperty({
        description: "채팅방 생성 시간 (타임스탬프)",
        example: 1672531199000,
    })
    readonly timestamp: string;

    constructor(
        id: bigint,
        nickname: string,
        profile: string,
        messages: ChatMessageDto[],
        isEnabled: boolean,
        timestamp: string,
    ) {
        this.id = id.toString();
        this.nickname = nickname;
        this.profile = profile;
        this.messages = messages;
        this.isEnabled = isEnabled;
        this.timestamp = timestamp;
    }
}