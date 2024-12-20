import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetAllMemberChatroomsResponseDto {
    @ApiProperty({
        description: "채팅방 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "상담사 이름",
        example: "이춘식",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "상담사 프로필 사진",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "가장 최근 메시지 내용",
        example: "안녕하세요! 무엇을 도와드릴까요?",
    })
    readonly recentMessage: string;

    @ApiProperty({
        description: "최근 메시지 시간",
        example: "2024-11-27T14:32:00Z",
    })
    readonly recentMessageTime: string;

    @ApiProperty({
        description: "활성화 여부 (true/false)",
        example: true,
    })
    readonly isEnabled: boolean;

    constructor(
        id: string,
        nickname: string,
        profile: string,
        recentMessage: string,
        recentMessageTime: string,
        isEnabled: boolean,
    ) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.recentMessage = recentMessage;
        this.recentMessageTime = recentMessageTime;
        this.isEnabled = isEnabled;
    }
}
