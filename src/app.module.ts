import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';

import AppConfig from './common/config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketModule } from './market/market.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { HomeBannerModule } from './home-banner/home-banner.module';
import { SearchModule } from './search/search.module';
//import { JwtGuard } from 'auth/jwt.guard';
//import { JwtStrategy } from 'auth/pasport/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'uploads'), // TODO: just configure it
        }),
        ThrottlerModule.forRoot([{
            ttl: 15 * 60 * 1000,
            limit: 100
        }]),
        CommonModule,
        UsersModule,
        MarketModule,
        ImageUploadModule,
        HomeBannerModule,
        SearchModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
})
export class AppModule { }
