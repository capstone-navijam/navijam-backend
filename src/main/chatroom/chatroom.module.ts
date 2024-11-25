import {
    Module,
} from "@nestjs/common";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    ChatroomService,
} from "@main/chatroom/chatroom.service";
import {
    ChatroomController,
} from "@main/chatroom/chatroom.controller";

@Module({
    imports: [PrismaModule,],
    controllers: [ChatroomController,],
    providers: [ChatroomService,],
})
export class ChatroomModule {}