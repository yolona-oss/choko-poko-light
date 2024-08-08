import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ConfigService } from '@nestjs/config';
import { DispatchError } from 'internal/DispatchError';
import { JwtGuard } from 'auth/jwt.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');

    app.setGlobalPrefix('api')
    app.useGlobalFilters(new DispatchError())
    app.enableCors()

    await app.listen(<number>port,
                     () => {
                         console.log(`Server is running http://localhost:${port}`)
                     });
}

bootstrap();
