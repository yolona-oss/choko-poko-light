import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { ProductReviewsDocument } from './schemas/product-reviews.schema';
import { CRUDService } from './../../../common/misc/crud-service';

@Injectable()
export class ProductReviewsService extends CRUDService<ProductReviewsDocument> {
    constructor(
        @InjectModel('ProductReviews')
        readonly productReviewsModel: Model<ProductReviewsDocument>
    ) {
        super(productReviewsModel)
    }
}
