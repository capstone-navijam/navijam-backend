import {
    ApiProperty,
} from "@nestjs/swagger";

export class SignUpResponseDto {
    @ApiProperty({
        description: "이메일",
    })
    email: string;

    @ApiProperty({
        description: "닉네임",
    })
    nickname: string;

    @ApiProperty({
        description: "프로필",
    })
    profile: string;

    // @ApiProperty({
    //     description: "주소",
    // })
    // address: string;
    //
    // @ApiProperty({
    //     description: "이름",
    // })
    // name: string;
    //
    // @ApiProperty({
    //     description: "경력",
    // })
    // career: string;
    //
    // @ApiProperty({
    //     description: "한 줄 소개",
    // })
    // description: string;
    //
    // @ApiProperty({
    //     description: "전화번호",
    // })
    // phoneNumber: string;

    constructor(
        email: string,
        nickname: string,
        profile: string,
        // address: string,
        // name: string,
        // career: string,
        // description: string,
        // phoneNumber: string,
    ) {
        this.email = email;
        this.nickname = nickname;
        this.profile = profile;
        // this.address = address;
        // this.name = name;
        // this.career = career;
        // this.description = description;
        // this.phoneNumber = phoneNumber;
    }
}
