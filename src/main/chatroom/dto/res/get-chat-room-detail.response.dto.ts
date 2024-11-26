import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetChatroomDetailResponseDto {
    @ApiProperty({
        description: "채팅방 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "상담사 닉네임",
        example: "이춘식",
    })
    readonly listenerNickname: string;

    @ApiProperty({
        description: "상담사 프로필 사진 URL",
        example: "https://example.com/profile.jpg",
    })
    readonly listenerProfile: string;

    @ApiProperty({
        description: "마지막 채팅 메시지",
        example: "안녕하세요! 무엇을 도와드릴까요?",
    })
    readonly lastMessage: string;

    @ApiProperty({
        description: "마지막 메시지 전송 시간 (yyyy-MM-dd HH:mm)",
        example: "2024-11-27 14:32",
    })
    readonly lastMessageTime: string;

    @ApiProperty({
        description: "채팅방 활성화 여부",
        example: true,
    })
    readonly isEnabled: boolean;

    constructor(
        id: string,
        listenerNickname: string,
        listenerProfile: string,
        lastMessage: string,
        lastMessageTime: string,
        isEnabled: boolean,
    ) {
        this.id = id;
        this.listenerNickname = listenerNickname;
        this.listenerProfile = listenerProfile;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.isEnabled = isEnabled;
    }
}
