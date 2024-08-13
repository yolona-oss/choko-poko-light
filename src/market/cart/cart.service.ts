import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CRUDService } from './../../internal/crud-service';
import { InjectModel } from '@nestjs/mongoose';
import { CartDocument } from './cart.schema';

@Injectable()
export class CartService extends CRUDService<CartDocument> {
    constructor(
        @InjectModel('Cart')
        readonly cartModel: Model<CartDocument>
    ) {
        super(cartModel)
    }
}
