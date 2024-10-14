import {
    Module,
} from "@nestjs/common";
import {
    CommunityController,
} from "./community.controller";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    AuthModule,
} from "@main/auth/auth.module";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    CommunityService,
} from "@main/community/community.service";

@Module({
    imports: [PrismaModule,
        AuthModule,],
    controllers: [CommunityController,],
    providers: [CommunityService,
        RolesGuard,],
})
export class CommunityModule {
}
