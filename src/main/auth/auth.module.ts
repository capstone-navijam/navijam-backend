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

@Module({
    imports: [
        JwtModule.register({
            signOptions: {
                expiresIn: "1h",
            },

        }),
    ],
    controllers: [AuthController,],
    providers: [AuthService,],
})

export class AuthModule {
}