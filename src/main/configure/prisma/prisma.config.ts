import {
    PrismaClient,
} from "@prisma/client";
import {
    INestApplication, Injectable, OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class PrismaConfig extends PrismaClient implements OnModuleInit {
    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async enableShutdownHooks(
        app: INestApplication,
    ): Promise<void> {
        process.on("beforeExit", async () => {
            await app.close();
        });
    }
}