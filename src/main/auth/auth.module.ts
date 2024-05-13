import {
    Module,
} from "@nestjs/common";
import {
    AuthController,
} from "@main/auth/auth.controller";
import {
    AuthService,
} from "@main/auth/auth.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";

@Module({
    imports: [PrismaModule,],
    controllers: [AuthController,],
    providers: [AuthService,],
})
export class AuthModule {
}