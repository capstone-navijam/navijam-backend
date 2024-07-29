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

@Module({
    imports: [PrismaModule,],
    controllers: [ConsoleController,],
    providers: [ConsoleService,],
})
export class ConsoleModule {
}
