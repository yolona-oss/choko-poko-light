import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

import { ProductSchema } from '../products/schemas/products.schema';
import { UserSchema } from '../../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Cart', schema: CartSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Product', schema: ProductSchema },
        ])
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}
