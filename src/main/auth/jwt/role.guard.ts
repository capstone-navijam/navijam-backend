import {
    Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from "@nestjs/common";
import {
    Reflector,
} from "@nestjs/core";
import {
    Role,
} from "@prisma/client";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<Role[]>("roles", context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.member;

        if (!roles.includes(user.role)) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        return true;
    }
}
