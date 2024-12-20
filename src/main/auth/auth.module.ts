import {
    Module,
} from "@nestjs/common";
import {
    JwtModule,
} from "@nestjs/jwt";
import {
    AuthController,
} from "@main/auth/auth.controller";
import {
    AuthService,
} from "@main/auth/auth.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    PrismaConfig,
} from "@main/configure/prisma/prisma.config";
import {
    JwtStrategy,
} from "@main/auth/jwt/jwt.strategy";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            signOptions: {
                expiresIn: "1h",
            },

        }),
    ],
    controllers: [AuthController,],
    providers: [AuthService,
        PrismaConfig,
        JwtStrategy,
        RolesGuard,],
    exports: [AuthService,
        JwtModule,],
})

export class AuthModule {
}