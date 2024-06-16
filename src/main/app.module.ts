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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,],
    controllers: [],
    providers: [],
})
export class AppModule {
}