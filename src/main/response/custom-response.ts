import {
    ApiProperty,
} from "@nestjs/swagger";

export default class CustomResponse<T> {
    @ApiProperty({
        type: String,
        description: "응답 시간",
    }
    )
    readonly timestamp: string;

    @ApiProperty({
        type: String,
        description: "응답 메세지",
    })
    readonly message: string;

    @ApiProperty({
        description: "응답 데이터",
    })
    readonly data: T;

    constructor(data: T, message: string) {
        this.data = data;
        this.message = message;

        this.timestamp = new Date().toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            hour12: true,
        });
    }
}