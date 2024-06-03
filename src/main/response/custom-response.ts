export default class CustomResponse<T> {
    readonly timestamp: string;
    readonly message: string;

    constructor(readonly data: T, message: string) {
        this.timestamp = new Date().toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
        });
        this.message = message;
    }
}