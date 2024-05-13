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

@Module({
    imports: [AuthModule,
        ConfigModule.forRoot(),
        PrismaModule,],
    controllers: [AuthController,],
    providers: [AuthService,],
})
export class AppModule {
}