import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetListenerDetailResponseDto {
    @ApiProperty({
        type: String,
        description: "Listener Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        type: String,
        description: "이름",
        example: "상담사",
    })
    readonly nickname: string;

    @ApiProperty({
        type: String,
        description: "프로필",
        example: "https://example.com/profile.jpg",
    })
    readonly profile: string;

    @ApiProperty({
        description: "카테고리",
        enum: Category,
        isArray: true,
        example: ["자유",],
    })
    readonly categories: Category[];

    @ApiProperty({
        type: String,
        description: "한 줄 소개",
        example: "당신의 하루를 웃게 해드리겠습니다.",
    })
    readonly description: string;

    @ApiProperty({
        type: String,
        description: "주소",
        example: "서울시 강남구 개포2동 나비잠 상담센터",
    })
    readonly address: string;

    @ApiProperty({
        type: String,
        description: "전화번호",
        example: "010-1234-5678",
    })
    readonly phoneNumber: string;

    @ApiProperty({
        type: String,
        description: "이메일",
        example: "example@example.com",
    })
    readonly email: string;

    @ApiProperty({
        type: Array,
        description: "경력",
        example: ["전문심리상담경력",
            "정신보건임상심리사 1급",],
    })
    readonly career: string[];

    constructor(
        id: string,
        nickname: string,
        profile: string,
        categories: Category[],
        description: string,
        address: string,
        phoneNumber: string,
        email: string,
        career: string[],
    ) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.categories = categories;
        this.description = description;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.career = career;
    }
}