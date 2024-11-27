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
import {
    S3Module,
} from "@main/s3/s3.module";
import {
    FileModule,
} from "@main/file/file.module";
import {
    ListenerModule,
} from "./listener/listener.module";
import {
    CommunityService,
} from "./community/community.service";
import {
    CommunityModule,
} from "./community/community.module";
import {
    MypageController,
} from "./mypage/mypage.controller";
import {
    MypageModule,
} from "./mypage/mypage.module";
import {
    MypageService,
} from "@main/mypage/mypage.service";
import {
    ChatroomModule,
} from "@main/chatroom/chatroom.module";
import {
    ChatModule,
} from "@main/chat/chat.module";
import {
    ReservationModule,
} from "@main/reservation/reservation.module";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        ComfortModule,
        ConsoleModule,
        S3Module,
        FileModule,
        ListenerModule,
        CommunityModule,
        MypageModule,
        ChatroomModule,
        ChatModule,
        ReservationModule,
    ],
    controllers: [ComfortController,
        MypageController,],
    providers: [ComfortService,
        CommunityService,
        MypageService,],
})
export class AppModule {
}