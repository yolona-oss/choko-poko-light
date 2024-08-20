import { Module } from '@nestjs/common';

import { APP_GUARD, RouterModule } from '@nestjs/core';

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
import { JwtGuard } from './auth/guards/jwt.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './market/orders/orders.module';
import { WishlistModule } from './market/wishlist/wishlist.module';
import { CartModule } from './market/cart/cart.module';

@Module({
    imports: [
        CommonModule,
        UsersModule,
        MarketModule,
        ImageUploadModule,
        HomeBannerModule,
        AuthModule,
        JwtModule,

        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
            cache: true
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'uploads'),
        }),
        ThrottlerModule.forRoot([{
            ttl: 15 * 60 * 1000,
            limit: 100
        }]),
        RouterModule.register([
            {
                path: 'users',
                module: UsersModule,
                children: [
                    {
                        path: 'orders',
                        module: OrdersModule
                    },
                    {
                        path: 'wishlist',
                        module: WishlistModule
                    },
                    {
                        path: 'cart',
                        module: CartModule

                    },
                    {
                        path: 'auth',
                        module: AuthModule
                    }
                ]
            }
        ]),
    ],
    providers: [
        //{
        //    provide: APP_GUARD,
        //    useClass: ThrottlerGuard
        //},
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
    ],
})
export class AppModule { }
