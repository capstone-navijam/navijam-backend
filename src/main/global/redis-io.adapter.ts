import {
    Injectable,
} from "@nestjs/common";
import {
    IoAdapter,
} from "@nestjs/platform-socket.io";
import * as redis from "redis";
import {
    ConfigService,
} from "@nestjs/config";
import {
    ServerOptions,
} from "socket.io";
import {
    createAdapter,
} from "@socket.io/redis-adapter";

@Injectable()
export class RedisIoAdapter extends IoAdapter {
    private readonly pubClient: redis.RedisClientType;
    private readonly subClient: redis.RedisClientType;

    constructor(configService: ConfigService) {
        super();

        const redisHost = configService.get<string>("REDIS_HOST", "localhost");
        const redisPort = configService.get<number>("REDIS_PORT", 16379);

        this.pubClient = redis.createClient({
            url: `redis://${redisHost}:${redisPort}`,
        });
        this.subClient = this.pubClient.duplicate();
    }

    async createIOServer(port: number, options?: ServerOptions): Promise<void> {
        const server = super.createIOServer(port, options);

        await this.pubClient.connect();
        await this.subClient.connect();

        const redisAdapter = createAdapter(this.pubClient, this.subClient);
        server.adapter(redisAdapter);

        return server;
    }

    async onModuleDestroy() {
        await this.pubClient.disconnect();
        await this.subClient.disconnect();
    }
}