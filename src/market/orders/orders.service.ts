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
        const docs = await super.getAllDocuments()
        for (const doc of docs) {
            for (const product of doc.products) {
                await this.imageUploadService.removeConcreetImageFromDefaultCollection(product.image)
            }
        }

        return await super.removeDocumentById(id)
    }
}
