import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CRUDService } from './../../internal/crud-service';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersDocument, OrdersEntity } from './orders.schema';
import { ImageUploadService } from './../../image-upload/image-upload.service';

@Injectable()
export class OrdersService extends CRUDService<OrdersDocument> {
    constructor(
        @InjectModel('Orders')
        private readonly ordersModel: Model<OrdersDocument>,
        private readonly imageUploadService: ImageUploadService
    ) {
        super(ordersModel)
    }

    override async removeDocumentById(id: string) {
        const doc = await super.getDocumentById(id)

        for (const product of doc.products) {
            await this.imageUploadService.removeDocumentById(product.image.toString())
        }

        return await super.removeDocumentById(id)
    }
}
