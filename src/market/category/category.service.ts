import { Document, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CategoryDocument } from './category.schema';
import { ImageUploadService } from './../../image-upload/image-upload.service';
import { CRUDService } from './../../internal/crud-service';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

@Injectable()
export class CategoryService extends CRUDService<CategoryDocument> {
    constructor(
        @InjectModel('Category')
        readonly categoryModel: Model<CategoryDocument>,
        private imageUploadService: ImageUploadService
    ) {
        super(categoryModel)
    }

    async getFiltredEntities(page: number, perPage: number) {
        const totalDocs = await this.getDocumentsCount();
        const totalPages = Math.ceil(totalDocs / perPage);

        if (page > totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        let subCategoryArray = await this.categoryModel.find().skip((page - 1) * perPage).limit(perPage).exec();

        if (!subCategoryArray) {
            new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return {
            categoryList: subCategoryArray,
            totalPages: totalPages,
            page: page
        }
    }

    override async removeDocumentById(id: string) {
        await this.imageUploadService.removeImagesFromModelById(this.categoryModel, id)
        return super.removeDocumentById(id)
    }
}
