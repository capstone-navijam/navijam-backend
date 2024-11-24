import {
    Module,
} from "@nestjs/common";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ChatGateway,
} from "@main/chat/chat.gateway";

@Module({
    imports: [PrismaModule,],
    providers: [ChatGateway,],
})
export class ChatModule {}