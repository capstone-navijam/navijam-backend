import {
    Module,
} from "@nestjs/common";
import {
    ConsoleController,
} from "@main/console/console.controller";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ConsoleService,
} from "@main/console/console.service";
import {
    AuthModule,
} from "@main/auth/auth.module";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";

@Module({
    imports: [PrismaModule,
        AuthModule,],
    controllers: [ConsoleController,],
    providers: [ConsoleService,
        RolesGuard,],
})
export class ConsoleModule {
}
