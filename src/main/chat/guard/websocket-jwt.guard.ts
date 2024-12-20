import {
    CanActivate, ExecutionContext, Injectable,
} from "@nestjs/common";
import {
    ConfigService,
} from "@nestjs/config";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    Observable,
} from "rxjs";
import {
    UnauthorizedException,
} from "@main/exception/websocket/common/unauthorized.exception";
import {
    BadRequestException,
} from "@main/exception/websocket/common/bad-request.exception";
import {
    WsException,
} from "@nestjs/websockets";

@Injectable()
export class WebSocketJwtGuard implements CanActivate {
    private readonly jwtSecret: string;

    constructor(configService: ConfigService,
                private readonly jwtService: JwtService) {
        this.jwtSecret = configService.get<string>("JWT_SECRET") ?? "secret";
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const authToken = client.handshake.auth.token;

        if (!authToken) {
            throw new UnauthorizedException("Missing authorization token");
        }

        try {
            // Bearer 토큰에서 실제 JWT 토큰 부분만 추출
            const tokens = authToken.split(" ");
            if (tokens.length <= 1 || tokens[0].toLowerCase() !== "bearer") {
                throw new BadRequestException("Invalid Token Format");
            }

            const token = tokens[1];
            const decoded = this.jwtService.verify(token, {
                secret: this.jwtSecret,
            }
            );

            client.memberId = decoded.sub;

            // 인증 성공하면 true 반환
            return true;
        } catch (error) {
            throw new WsException("Invalid token");
        }
    }
}