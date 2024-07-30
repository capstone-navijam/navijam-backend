import {
    Module,
} from "@nestjs/common";
import {
    ComfortService,
} from "./comfort.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ComfortController,
} from "@main/comfort/comfort.controller";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    AuthModule,
} from "@main/auth/auth.module";

@Module({
    imports: [PrismaModule,
        AuthModule,],
    controllers: [ComfortController,],
    providers: [ComfortService,
        RolesGuard,],
})
export class ComfortModule {
}