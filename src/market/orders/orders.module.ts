import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersSchema } from './orders.schema'
import { OrdersController } from './orders.controller';
import { ImageUploadModule } from './../../image-upload/image-upload.module';

@Module({
    providers: [OrdersService],
    imports: [
        MongooseModule.forFeature([
            { name: 'Orders', schema: OrdersSchema },
        ]),
        ImageUploadModule
    ],
    //exports: [],
    controllers: [OrdersController]
})
export class OrdersModule {}
