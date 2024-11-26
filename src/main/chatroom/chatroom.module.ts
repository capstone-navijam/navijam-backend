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
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    JwtModule,
} from "@nestjs/jwt";

@Module({
    imports: [PrismaModule,
        JwtModule,],
    controllers: [ChatroomController,],
    providers: [ChatroomService,
        RolesGuard,
    ],

})

export class ChatroomModule {
}