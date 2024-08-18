import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { ProductReviewsDocument } from './schemas/product-reviews.schema';
import { ProductEntity } from '../schemas/products.schema';
import { CreateProductReviewDto } from './dto/create-review.dto';
import { AppError, AppErrorTypeEnum } from 'src/common/app-error';

@Injectable()
export class ProductReviewsService {
    constructor(
        @InjectModel('ProductReviews')
        readonly productReviewsModel: Model<ProductReviewsDocument>
    ) { }

    async findAll() {
        return await this.productReviewsModel.find().populate('product').exec()
    }

    async findById(id: string) {
        return await this.productReviewsModel.findById(id).populate('product').exec()
    }

    async findCount() {
        return await this.productReviewsModel.countDocuments()
    }

    async findUserReviews(userId: string) {
        return await this.productReviewsModel.find({user: userId})
            .populate<{ product: ProductEntity }>('product').exec()
    }

    async findByProductId(productId: string) {
        return await this.productReviewsModel.find({product: productId}).populate('product').exec()
    }

    async createReview(data: CreateProductReviewDto) {
        try {
            return await this.productReviewsModel.create(data)
        } catch (error) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                errorMessage: JSON.stringify(error)
            })
        }
    }
}
