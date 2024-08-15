import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExeptionFilter } from './common/filters/all-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');
    console.log("port: " + port)

    const corsOptions = {

    }

    const helmetOptions = {
        crossOriginEmbedderPolicy: false,
    }

    app.use(helmet(helmetOptions))
    app.use(compression())
    app.setGlobalPrefix('api')
    app.useGlobalFilters(new AllExeptionFilter())
    app.enableCors(corsOptions)

    const config = new DocumentBuilder()
        .setTitle('Spice API')
        .setDescription('Spice API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);

    await app.listen(<number>port,
                     () => {
                         console.log(`Server is running http://localhost:${port}`)
                     });
}

bootstrap();
