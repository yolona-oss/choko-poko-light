import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersSchema } from './orders.schema'
import { OrdersController } from './orders.controller';
import { ImageUploadModule } from './../../image-upload/image-upload.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Orders', schema: OrdersSchema },
        ]),
        ImageUploadModule
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService]
})
export class OrdersModule {}
