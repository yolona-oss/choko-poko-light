import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRAMsSchema } from './product-rams.schema';
import { ProductRAMsService } from './product-rams.service';
import { ProductRamsController } from './product-rams.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ProductRAMs', schema: ProductRAMsSchema },
        ])
    ],
    providers: [ProductRAMsService],
    exports: [ProductRAMsService],
    controllers: [ProductRamsController]
})
export class ProductRAMsModule {}

