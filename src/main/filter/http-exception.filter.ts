import {
    ExceptionFilter, Catch, ArgumentsHost, HttpException,
} from "@nestjs/common";
import {
    Request, Response,
} from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        let message: string | string[];
        if (typeof exception.getResponse() === "object") {
            const exceptionResponse =  exception.getResponse() as { message: string[] };
            message = exceptionResponse.message;
        } else {
            message = exception.message;
        }

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp : new Date().toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                }),
                path: request.url,
                message: message,
                error: exception.name,
                data: null,
            });
    }
}
