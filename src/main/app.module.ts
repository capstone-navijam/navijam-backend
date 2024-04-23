import {
    Module,
} from "@nestjs/common";
import {
    MembersModule,
} from "@main/members/members.module";
import {
    MembersController,
} from "@main/members/members.controller";
import {
    MembersService,
} from "@main/members/members.service";
import {
    ConfigModule,
} from "@nestjs/config";
import {
    PrismaModule,
} from "@main/configure/prisma.module";

@Module({
    imports: [MembersModule,
        ConfigModule.forRoot(),
        PrismaModule,],
    controllers: [
        MembersController,],
    providers: [
        MembersService,],
})
export class AppModule {
}