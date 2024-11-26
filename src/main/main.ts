import {
    NestFactory,
} from "@nestjs/core";
import {
    AppModule,
} from "./app.module";
import {
    DocumentBuilder, SwaggerModule,
} from "@nestjs/swagger";
import {
    ValidationPipe,
} from "@nestjs/common";
import {
    HttpExceptionFilter,
} from "@main/filter/http-exception.filter";
import {
    ConfigService,
} from "@nestjs/config";
import {
    RedisIoAdapter,
} from "@main/global/redis-io.adapter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle("Navijam")
        .setDescription("나비잠: 온라인 정신상담 웹 플랫폼")
        .setVersion("1.0.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("navijam", app, document);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        //whitelist: true,
        //forbidNonWhitelisted: ,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ["GET",
            "POST",
            "OPTIONS",
            "PUT",
            "PATCH",
            "DELETE",],
    });

    const configService = await app.get(ConfigService);
    const redisIoAdapter = new RedisIoAdapter(configService, app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    await app.listen(3000);
}

bootstrap();