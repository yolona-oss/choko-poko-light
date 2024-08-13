import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageUploadModule } from './../../image-upload/image-upload.module';
import { CategoryController } from './category.controller';
import { CategorySchema } from './category.schema';
import { CategoryService } from './category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategorySchema } from './sub-category.schema';
import { SubCategoryService } from './sub-category.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Category', schema: CategorySchema },
            { name: 'SubCategory', schema: SubCategorySchema }
        ]),
        ImageUploadModule
    ],
    providers: [SubCategoryService, CategoryService],
    exports: [SubCategoryService, CategoryService],
    controllers: [CategoryController, SubCategoryController]
})
export class CategoryModule {}
