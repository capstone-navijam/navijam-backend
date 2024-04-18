import {
    Module,
} from "@nestjs/common";
import {
    MembersController,
} from "@main/members/members.controller";
import {
    MembersService,
} from "@main/members/members.service";
import {
    PrismaModule,
} from "@main/configure/prisma.module";

@Module({
    imports: [PrismaModule,],
    controllers: [MembersController,],
    providers: [MembersService,],
})
export class MembersModule {
}