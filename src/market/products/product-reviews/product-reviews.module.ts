import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductReviewsService } from './product-reviews.service';

import { ProductReviewsSchema } from './schemas/product-reviews.schema';
import { UserSchema } from './../../../users/schemas/user.schema';
import { ProductSchema } from './../schemas/products.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'ProductReviews',  schema: ProductReviewsSchema },
            { name: 'Users',  schema: UserSchema },
            { name: 'Products',  schema: ProductSchema },
        ])
    ],
    providers: [ProductReviewsService],
    exports: [ProductReviewsService],
})
export class ProductReviewsModule {}
