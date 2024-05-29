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

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle("Navijam")
        .setDescription("나비잠: 온라인 정신상담 웹 플랫폼")
        .setVersion("1.0.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("navijam", app, document);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    await app.listen(3000);
}

bootstrap();