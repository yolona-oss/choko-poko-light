import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SubCategoryDocument } from './sub-category.schema';
import { CRUDService } from './../../internal/crud-service';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

@Injectable()
export class SubCategoryService extends CRUDService<SubCategoryDocument> {
    constructor(
        @InjectModel('SubCategory')
        readonly subCategoryModel: Model<SubCategoryDocument>
    ) {
        super(subCategoryModel)
    }

    async getFiltredEntities(page: number, perPage: number) {
        const totalDocs = await this.getDocumentsCount();
        const totalPages = Math.ceil(totalDocs / perPage);

        if (page > totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        let subCategoryArray = await this.subCategoryModel.find().populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!subCategoryArray) {
            new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return {
            subCategoryList: subCategoryArray,
            totalPages: totalPages,
            page: page
        }
    }

    override async getAllDocuments() {
        return await this.subCategoryModel.find().populate("category").exec()
    }
}
