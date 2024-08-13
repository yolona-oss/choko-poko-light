import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductSizeDocument } from './product-size.schema';
import { CRUDService } from './../../../internal/crud-service';

@Injectable()
export class ProductSizeService extends CRUDService<ProductSizeDocument> {
    constructor(
        @InjectModel('ProductSize')
        readonly productSizeModel: Model<ProductSizeDocument>
    ) {
        super(productSizeModel)
    }
}
