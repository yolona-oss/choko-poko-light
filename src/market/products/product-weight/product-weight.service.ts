import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductWeightDocument } from './product-weight.schema';
import { CRUDService } from './../../../internal/crud-service';

@Injectable()
export class ProductWeightService extends CRUDService<ProductWeightDocument> {
    constructor(
        @InjectModel('ProductWeight')
        readonly productWeightModel: Model<ProductWeightDocument>
    ) {
        super(productWeightModel)
    }
}
