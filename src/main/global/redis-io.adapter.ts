import {
    IoAdapter,
} from "@nestjs/platform-socket.io";
import {
    createClient, RedisClientType,
} from "redis";
import {
    ServerOptions,
} from "socket.io";
import {
    createAdapter,
} from "@socket.io/redis-adapter";
import {
    ConfigService,
} from "@nestjs/config";
import {
    INestApplication,
} from "@nestjs/common";

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;
    private pubClient: RedisClientType;
    private subClient: RedisClientType;

    constructor(configService: ConfigService, app: INestApplication) {
        super(app);
        const redisHost = configService.get<string>("REDIS_HOST", "localhost");
        const redisPort = configService.get<number>("REDIS_PORT", 16379);

        this.pubClient = createClient({
            url: `redis://${redisHost}:${redisPort}`,
        });
        this.subClient = this.pubClient.duplicate();
    }

    async connectToRedis(): Promise<void> {

        await Promise.all([this.pubClient.connect(),
            this.subClient.connect(),]);

        this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);

        return server;
    }
}