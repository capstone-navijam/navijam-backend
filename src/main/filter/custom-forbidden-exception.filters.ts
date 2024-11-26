import {
    ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpStatus,
} from "@nestjs/common";
import {
    Response,
} from "express";

@Catch(ForbiddenException)
export class CustomForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = HttpStatus.FORBIDDEN;
        const message = "접근 권한이 없습니다.";

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
                hour12: true,
            }),
            path: request.url,
            message: message,
            error: exception.name,
            data: null,
        });
    }
}
