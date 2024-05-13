export default class CustomResponse<T> {
    readonly timestamp: string;

    constructor(readonly data: T) {
        this.timestamp = new Date().toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
        });
    }
}