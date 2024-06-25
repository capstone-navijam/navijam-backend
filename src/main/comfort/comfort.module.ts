import {
    Module,
} from "@nestjs/common";
import {
    ComfortService,
} from "./comfort.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ComfortController,
} from "@main/comfort/comfort.controller";

@Module({
    imports: [PrismaModule,],
    controllers: [ComfortController,],
    providers: [ComfortService,],
})
export class ComfortModule {
}