import {
    Module,
} from "@nestjs/common";
import {
    AuthModule,
} from "@main/auth/auth.module";
import {
    AuthController,
} from "@main/auth/auth.controller";
import {
    AuthService,
} from "@main/auth/auth.service";
import {
    ConfigModule,
} from "@nestjs/config";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    JwtService,
} from "@nestjs/jwt";

@Module({
    imports: [AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,],
    controllers: [AuthController,],
    providers: [AuthService,
        JwtService,],
})
export class AppModule {
}