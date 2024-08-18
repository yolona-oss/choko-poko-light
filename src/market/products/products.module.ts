import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageUploadModule } from './../../image-upload/image-upload.module';
import { CategoryModule } from './../category/category.module';
import { CategorySchema } from './../category/schemas/category.schema';
import { SubCategorySchema } from './../category/schemas/sub-category.schema';
import { ProductReviewsModule } from './product-reviews/product-reviews.module';
import { ProductsController } from './products.controller';
import { ProductSchema } from './schemas/products.schema';
import { ProductsService } from './products.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Product', schema: ProductSchema },
            { name: 'Category', schema: CategorySchema },
            { name: 'SubCategory', schema: SubCategorySchema },
        ]),
        RouterModule.register([
            {
                path: 'products',
                module: ProductsModule,
            }
        ]),
        ProductReviewsModule,
        CategoryModule,
        ImageUploadModule,
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService]
})
export class ProductsModule {}
