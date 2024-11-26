import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetAllListenerResponseDto {
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
        description: "센터 번호",
        example: "02-1234-5678",
    })
    readonly contactNumber: string;

    @ApiProperty({
        type: Array,
        description: "경력",
        example: ["전문심리상담경력",
            "정신보건임상심리사 1급",],
    })
    readonly career: string[];

    @ApiProperty({
        type: Array,
        description: "학력",
        example: ["XX대학교 심리학과 박사",],
    })
    readonly education: string[];

    @ApiProperty({
        description: "상담 가능 시간",
        required: true,
        type: [String,],
        example: ["AM 9:00 ~ AM 10:00",
            "AM 11:00 ~ PM 7:00",],
    })
    readonly availableTime: string[];

    constructor(
        id: string,
        nickname: string,
        profile: string,
        categories: Category[],
        description: string,
        address: string,
        contactNumber: string,
        career: string[],
        education: string[],
        availableTime: string[],
    ) {
        this.id = id;
        this.nickname = nickname;
        this.profile = profile;
        this.categories = categories;
        this.description = description;
        this.address = address;
        this.contactNumber = contactNumber;
        this.career = career;
        this.education = education;
        this.availableTime = availableTime;
    }
}