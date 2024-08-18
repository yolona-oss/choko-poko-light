import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { WishlistSchema } from './schemas/wishlist.schema';
import { ProductSchema } from '../products/schemas/products.schema';
import { UserSchema } from '../../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Wishlist', schema: WishlistSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Product', schema: ProductSchema }
        ])
    ],
    controllers: [WishlistController],
    providers: [WishlistService],
    exports: [WishlistService]
})
export class WishlistModule {}
