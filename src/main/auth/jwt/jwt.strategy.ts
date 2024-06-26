import {
    Injectable,
} from "@nestjs/common";
import {
    PassportStrategy,
} from "@nestjs/passport";
import {
    ExtractJwt, Strategy,
} from "passport-jwt";
import {
    ConfigService,
} from "@nestjs/config";
import {
    Member,
} from "@prisma/client";
import {
    AuthService,
} from "@main/auth/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "navijam-token") {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: any): Promise<Member | null> {
        const member = await this.authService.validateMember(payload);
        if (member) {
            req.member = member;
        }

        return member;
    }
}
