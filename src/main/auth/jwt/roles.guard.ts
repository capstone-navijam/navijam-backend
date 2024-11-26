import {
    CanActivate, ExecutionContext, ForbiddenException, Injectable,
} from "@nestjs/common";
import {
    Reflector,
} from "@nestjs/core";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    ConfigService,
} from "@nestjs/config";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        const member = request.member; // JwtAuthGuard에서 설정된 사용자 정보

        if (!member) {
            throw new ForbiddenException("사용자 정보가 없습니다.");
        }

        const hasRole = requiredRoles.some((role) => role === member.role);
        if (!hasRole) {
            throw new ForbiddenException("접근 권한이 없습니다.");
        }

        return true;
    }
}
