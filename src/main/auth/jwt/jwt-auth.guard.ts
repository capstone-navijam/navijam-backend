import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import {
    AuthGuard,
} from "@nestjs/passport";
import {
    TokenExpiredError,
} from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard("navijam-token") {
    handleRequest(err: any, member: any, info: any, context: ExecutionContext) {
        if (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException("로그인이 필요합니다.");
            }
            throw err;
        }

        if (!member) {
            throw new UnauthorizedException("유효하지 않은 인증 정보입니다.");
        }

        const request = context.switchToHttp().getRequest();
        request.member = member;

        return member;
    }
}
