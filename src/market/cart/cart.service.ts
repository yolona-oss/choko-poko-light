import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CRUDService } from './../../common/misc/crud-service';
import { InjectModel } from '@nestjs/mongoose';
import { CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService extends CRUDService<CartDocument> {
    constructor(
        @InjectModel('Cart')
        readonly cartModel: Model<CartDocument>
    ) {
        super(cartModel)
    }
}
