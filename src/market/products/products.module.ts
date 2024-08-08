import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'common/cloudinary/cloudinary.module';
import { ImageUploadModule } from 'image-upload/image-upload.module';
import { CategoryModule } from 'market/category/category.module';
import { CategorySchema } from 'market/category/category.schema';
import { SubCategorySchema } from 'market/category/sub-category.schema';
import { ProductRAMsModule } from './product-rams/product-rams.module';
import { ProductReviewsModule } from './product-reviews/product-reviews.module';
import { ProductSizeModule } from './product-size/product-size.module';
import { ProductWeightModule } from './product-weight/product-weight.module';
import { ProductsController } from './products.controller';
import { ProductSchema } from './products.schema';
import { ProductsService } from './products.service';
import { RecentlyViewdModule } from './recently-viewd/recently-viewd.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Product', schema: ProductSchema },
            { name: 'Category', schema: CategorySchema },
            { name: 'SubCategory', schema: SubCategorySchema }
        ]),
        RouterModule.register([
            {
                path: 'products',
                module: ProductsModule,
                children: [
                    {
                        path: 'weight',
                        module: ProductWeightModule
                    },
                    {
                        path: 'rams',
                        module: ProductRAMsModule
                    },
                    {
                        path: 'size',
                        module: ProductSizeModule
                    },
                    {
                        path: 'reviews',
                        module: ProductReviewsModule
                    },
                ]
            }
        ]),
        ProductRAMsModule,
        ProductReviewsModule,
        ProductSizeModule,
        ProductWeightModule,
        RecentlyViewdModule,
        CategoryModule,
        ImageUploadModule,
        CloudinaryModule,
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService]
})
export class ProductsModule {}
