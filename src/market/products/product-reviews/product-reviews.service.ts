import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductReviewsDocument } from './product-reviews.schema';
import { CRUDService } from './../../../internal/crud-service';

@Injectable()
export class ProductReviewsService extends CRUDService<ProductReviewsDocument> {
    constructor(
        @InjectModel('ProductReviews')
        readonly productReviewsModel: Model<ProductReviewsDocument>
    ) {
        super(productReviewsModel)
    }
}
