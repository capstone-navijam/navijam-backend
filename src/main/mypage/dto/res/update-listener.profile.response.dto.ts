import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";

export class UpdateListenerProfileResponseDto {
    @ApiProperty({
        description: "이름",
        required: false,
    })
    readonly nickname: string;

    @ApiProperty({
        description: "주소",
        required: false,
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
        required: false,
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

    constructor(
        nickname: string,
        address: string,
        career: string[],
        education: string[],
        description: string,
        phoneNumber: string,
        contactNumber: string,
        category: Category[],
        availableTime: string[],
    ) {
        this.nickname = nickname;
        this.address = address;
        this.career = career;
        this.education = education;
        this.description = description;
        this.phoneNumber = phoneNumber;
        this.contactNumber = contactNumber;
        this.category = category;
        this.availableTime = availableTime;
    }
}