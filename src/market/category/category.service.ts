import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CategoryDocument } from './schemas/category.schema';

import { ImageUploadService } from './../../image-upload/image-upload.service';
import { CRUDService } from './../../internal/crud-service';

import { FilteringCategoryOptions } from './interfaces/filtring-category-options.interface';
import { FiltredCategoryList } from './interfaces/filtred-category-list.interface';

import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

import { OPQBuilder } from './../../internal/OptionalParamQueryBuilder';

@Injectable()
export class CategoryService extends CRUDService<CategoryDocument> {
    constructor(
        @InjectModel('Category')
        private readonly categoryModel: Model<CategoryDocument>,
        private readonly imageUploadService: ImageUploadService
    ) {
        super(categoryModel)
    }

    async findFiltredWrapper(opts: FilteringCategoryOptions): Promise<FiltredCategoryList> {
        const page: number = opts.page ? parseInt(opts.page) : 1
        const perPage = opts.perPage ? parseInt(opts.perPage) : undefined

        const totalDocuments = await this.categoryModel.countDocuments()
        const totalPages = +Math.ceil(totalDocuments / (perPage || 1))

        if (totalDocuments === 0) {
            return {
                categoryList: [],
                totalPages: 0,
                page: 0
            }
        }

        if (page > totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        const query = new OPQBuilder()
            .build()

        const docs = await this.categoryModel.find(query, null, { skip: (page - 1) * (perPage || 0), limit: perPage }).exec()

        if (!docs) {
            new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return {
            categoryList: docs,
            totalPages: totalPages,
            page: page
        }
    }

    override async removeDocumentById(id: string) {
        const doc = await super.getDocumentById(id)

        for (const image of doc.images) {
            await this.imageUploadService.removeDocumentById(image.toString())
        }
        return super.removeDocumentById(id)
    }
}
