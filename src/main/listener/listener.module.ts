import {
    Module,
} from "@nestjs/common";
import {
    ListenerController,
} from "./listener.controller";
import {
    ListenerService,
} from "./listener.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";

@Module({
    imports: [PrismaModule,],
    controllers: [ListenerController,],
    providers: [ListenerService,],
})
export class ListenerModule {
}
