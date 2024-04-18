import {
    Module,
} from "@nestjs/common";
import {
    AppController,
} from "./app.controller";
import {
    AppService,
} from "./app.service";
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
    controllers: [AppController,
        MembersController,],
    providers: [AppService,
        MembersService,],
})
export class AppModule {
}