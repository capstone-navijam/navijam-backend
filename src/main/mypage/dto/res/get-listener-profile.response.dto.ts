import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class GetListenerProfileResponseDto {
    @ApiProperty({
        description: "Listener Id",
        required: true,
    })
    readonly id: string;

    @ApiProperty({
        description: "이름",
        required: true,
    })
    readonly nickname: string;

    @ApiProperty({
        description: "주소",
        required: true,
    })
    readonly address: string;

    @ApiProperty({
        description: "경력",
        required: true,
    })
    readonly career: string[];

    @ApiProperty({
        description: "학력",
        required: true,
    })
    readonly education: string[];

    @ApiProperty({
        description: "한 줄 소개",
        required: true,
    })
    readonly description: string;

    @ApiProperty({
        description: "전화번호",
        required: true,
    })
    readonly phoneNumber: string;

    @ApiProperty({
        description: "센터 번호",
        required: true,
    })
    readonly contactNumber: string;

    @ApiProperty({
        description: "카테고리",
        required: true,
        enum: Category,
    })
    readonly category: Category[];

    @ApiProperty({
        description: "상담 가능 시간",
        required: true,
        type: [String,],
        example: ["AM 9:00 ~ AM 10:00",
            "AM 11:00 ~ PM 7:00",],
    })
    readonly availableTime: string[];

    @ApiProperty({
        description: "이메일",
        required: true,
        type: String,
    })
    readonly email: string;

    @ApiProperty({
        description: "상담 가격 (포맷된 값)",
        example: "₩50,000",
    })
    readonly formattedPrice: string;

    constructor(
        id: string,
        nickname: string,
        address: string,
        career: string[],
        education: string[],
        description: string,
        phoneNumber: string,
        contactNumber: string,
        category: Category[],
        availableTime: string[],
        email: string,
        formattedPrice: string,
    ) {
        this.id = id;
        this.nickname = nickname;
        this.address = address;
        this.career = career;
        this.education = education;
        this.description = description;
        this.phoneNumber = phoneNumber;
        this.contactNumber = contactNumber;
        this.category = category;
        this.availableTime = availableTime;
        this.email = email;
        this.formattedPrice = formattedPrice;
    }
}