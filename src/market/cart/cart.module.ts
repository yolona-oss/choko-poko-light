import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Cart', schema: CartSchema }
        ])
    ],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule {}
