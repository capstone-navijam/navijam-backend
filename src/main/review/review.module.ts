import {
    Module,
} from "@nestjs/common";
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
    ReviewController,
} from "@main/review/review.controller";
import {
    ReviewService,
} from "@main/review/review.service";

@Module({
    imports: [PrismaModule,
        AuthModule,],
    controllers: [ReviewController,],
    providers: [ReviewService,
        RolesGuard,],
})
export class ReviewModule {
}
