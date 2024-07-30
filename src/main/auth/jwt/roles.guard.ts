import {
    Injectable, CanActivate, ExecutionContext, ForbiddenException,
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

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) throw new ForbiddenException("접근 권한이 없습니다.");

        const decoded = this.jwtService.verify(token, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });
        const userRole = decoded.role;

        return requiredRoles.some(role => role === userRole);
    }
}
