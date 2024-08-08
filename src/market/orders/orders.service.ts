import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CRUDService } from 'internal/crud-service';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersDocument } from './orders.schema';

@Injectable()
export class OrdersService extends CRUDService<OrdersDocument> {
    constructor(
        @InjectModel('Orders')
        readonly ordersModel: Model<OrdersDocument>
    ) {
        super(ordersModel)
    }
}
