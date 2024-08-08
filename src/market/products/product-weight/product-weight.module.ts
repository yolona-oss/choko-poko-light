import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductWeightSchema } from './product-weight.schema';
import { ProductWeightService } from './product-weight.service';
import { ProductWeightController } from './product-weight.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ProductWeight',  schema: ProductWeightSchema }
        ])
    ],
    providers: [ProductWeightService],
    exports: [ProductWeightService],
    controllers: [ProductWeightController]
})
export class ProductWeightModule {}
