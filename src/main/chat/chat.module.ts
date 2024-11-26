import {
    Module,
} from "@nestjs/common";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ChatGateway,
} from "@main/chat/chat.gateway";
import {
    ChatService,
} from "@main/chat/chat.service";
import {
    JwtModule,
} from "@nestjs/jwt";

@Module({
    imports: [PrismaModule,
        JwtModule,],
    providers: [ChatGateway,
        ChatService,],
})
export class ChatModule {}