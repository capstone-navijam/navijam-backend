import {
    Module,
} from "@nestjs/common";
import {
    MypageService,
} from "./mypage.service";
import {
    PrismaModule,
} from "@main/configure/prisma/prisma.module";
import {
    AuthModule,
} from "@main/auth/auth.module";
import {
    MypageController,
} from "@main/mypage/mypage.controller";
import {
    FileModule,
} from "@main/file/file.module";

@Module({
    imports: [PrismaModule,
        AuthModule,
        FileModule,],
    controllers: [MypageController,],
    providers: [MypageService,],
})
export class MypageModule {
}
