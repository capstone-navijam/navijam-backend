import {
    PrismaClient,
} from "@prisma/client";
import {
    Injectable, OnModuleDestroy, OnModuleInit,
} from "@nestjs/common";

@Injectable()
export class PrismaConfig extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}