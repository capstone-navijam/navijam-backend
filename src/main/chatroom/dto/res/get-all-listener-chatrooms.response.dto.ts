import {
    ApiProperty,
} from "@nestjs/swagger";

export class GetAllListenerChatroomsResponseDto {
    @ApiProperty({
        description: "채팅방 ID",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "회원 닉네임",
        example: "회원1",
    })
    readonly nickname: string;

    @ApiProperty({
        description: "회원 프로필 사진",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "가장 최근 메시지 내용",
        example: "안녕하세요! 상담 하러 왔습니다.",
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
