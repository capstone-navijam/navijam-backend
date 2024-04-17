import {
    NestFactory,
} from "@nestjs/core";
import {
    AppModule,
} from "./app.module";
import {
    DocumentBuilder, SwaggerModule,
} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle("Navijam")
        .setDescription("나비잠: 온라인 정신상담 웹 플랫폼")
        .setVersion("1.0.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("navijam", app, document);

    await app.listen(3000);
}

bootstrap();