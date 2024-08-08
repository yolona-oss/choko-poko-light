import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSizeSchema } from './product-size.schema';
import { ProductSizeService } from './product-size.service';
import { ProductSizeController } from './product-size.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ProductSize',  schema: ProductSizeSchema }
        ])
    ],
    providers: [ProductSizeService],
    controllers: [ProductSizeController],
    exports: [ProductSizeService],
})
export class ProductSizeModule {}
