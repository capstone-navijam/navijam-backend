import {
    Module,
} from "@nestjs/common";
import {
    AuthModule,
} from "@main/auth/auth.module";
import {
    ConfigModule,
} from "@nestjs/config";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ComfortController,
} from "./comfort/comfort.controller";
import {
    ComfortModule,
} from "./comfort/comfort.module";
import {
    ComfortService,
} from "@main/comfort/comfort.service";
import {
    ConsoleModule,
} from "@main/console/console.module";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        ComfortModule,
        ConsoleModule,],
    controllers: [ComfortController,],
    providers: [ComfortService,],
})
export class AppModule {
}