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
    ReservationService,
} from "@main/reservation/reservation.service";
import {
    ReservationController,
} from "@main/reservation/reservation.controller";

@Module({
    imports: [PrismaModule,
        AuthModule,],
    controllers: [ReservationController,],
    providers: [ReservationService,],
})
export class ReservationModule {}