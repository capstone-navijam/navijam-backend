import {
    ApiProperty,
} from "@nestjs/swagger";
import {
    Category,
} from "@main/global/category";
import {
    GetAllConsoleResponseDto,
} from "@main/console/dto/res/get-all-console-response.dto";

export class GetComfortAndConsolesResponseDto {
    @ApiProperty({
        description: "Comfort Board Id",
        example: "1",
    })
    readonly id: string;

    @ApiProperty({
        description: "위로받기 게시글 주제",
        example: [Category.FREE,
            Category.BREAKUP,],
        required: true,
        enum: Category,
        isArray: true,
    })
    readonly categories: Category[];

    @ApiProperty({
        description: "게시글 제목",
        example: "조언 부탁드립니다.",
    })
    readonly title: string;

    @ApiProperty({
        description: "게시글 내용",
        example: "조언 부탁드립니다.",
    })
    readonly content: string;

    @ApiProperty({
        description: "Writer Id",
        example: "1",
    })
    readonly writerId: string;

    @ApiProperty({
        description: "작성자 프로필 URL",
        example: "http://profile.com/profile1.jpg",
    })
    readonly writerProfile: string;

    @ApiProperty({
        description: "작성자 닉네임",
        example: "choonsik",
    })
    readonly writerNickname: string;

    @ApiProperty({
        description: "게시글 작성 시간",
        example: "2024-01-02T16:06:20.43672",
    })
    readonly createdAt: string;

    @ApiProperty({
        description: "답변 여부",
        example: true,
    })
    readonly isAnswered: boolean;

    @ApiProperty({
        description: "위로하기 답글 목록",
        type: [GetAllConsoleResponseDto,],
    })
    readonly consoles: GetAllConsoleResponseDto[];

    constructor(
        id: string,
        categories: Category[],
        title: string,
        content: string,
        writerId: string,
        writerProfile: string,
        writerNickname: string,
        createdAt: string,
        isAnswered: boolean,
        consoles: GetAllConsoleResponseDto[]
    ) {
        this.id = id;
        this.categories = categories;
        this.title = title;
        this.content = content;
        this.writerId = writerId;
        this.writerProfile = writerProfile;
        this.writerNickname = writerNickname;
        this.createdAt = createdAt;
        this.isAnswered = isAnswered;
        this.consoles = consoles;
    }
}
