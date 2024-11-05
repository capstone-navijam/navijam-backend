import {
    Injectable,
    ExecutionContext, UnauthorizedException,
} from "@nestjs/common";
import {
    AuthGuard,
} from "@nestjs/passport";
import {
    TokenExpiredError,
} from "jsonwebtoken";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("navijam-token") {
    handleRequest(err: any, member: any, info: any, context: ExecutionContext) {
        if (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException("로그인이 필요합니다.");
            }
            throw err;
        }

        // 인증 실패 시에도 요청을 허용하되, member는 null로 설정
        const request = context.switchToHttp().getRequest();
        request.member = member || null;

        return member;
    }
}
