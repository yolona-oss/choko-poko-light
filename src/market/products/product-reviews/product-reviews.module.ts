import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductReviewsSchema } from './product-reviews.schema';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsController } from './product-reviews.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ProductReviews',  schema: ProductReviewsSchema }
        ])
    ],
    providers: [ProductReviewsService],
    exports: [ProductReviewsService],
    controllers: [ProductReviewsController]
})
export class ProductReviewsModule {}
