import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { WishlistModule } from './../market/wishlist/wishlist.module';
import { CartModule } from './../market/cart/cart.module';

import { UsersService } from './users.service';

import { UserSchema } from './schemas/user.schema';
import { ProductReviewsSchema } from './../market/products/product-reviews/schemas/product-reviews.schema';

import { UsersController } from './users.controller';
import { OrdersModule } from './../market/orders/orders.module';
import { ImageUploadModule } from './../image-upload/image-upload.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'ProductReviews', schema: ProductReviewsSchema }
        ]),
        WishlistModule,
        OrdersModule,
        CartModule,
        ImageUploadModule
    ],
    exports: [UsersService]
})
export class UsersModule implements OnApplicationBootstrap {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.usersService.__createDefaultAdmin({
            name: this.configService.getOrThrow<string>("default_user.name"),
            email: this.configService.getOrThrow<string>("default_user.email"),
            phone: this.configService.getOrThrow<string>("default_user.phone"),
            password: this.configService.getOrThrow<string>("default_user.password"),
        })
    }
}
