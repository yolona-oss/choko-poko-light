import mongoose, { Document, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CategoryDocument } from './schemas/category.schema';
import { SubCategoryDocument } from './schemas/sub-category.schema';

import { ImageUploadService } from './../../image-upload/image-upload.service';
import { CRUDService } from './../../common/misc/crud-service';

import { FilteringCategoryOptions } from './interfaces/filtring-category-options.interface';
import { FiltredCategoryList } from './interfaces/filtred-category-list.interface';

import { AppError, AppErrorTypeEnum } from './../../common/app-error';

import { OPQBuilder } from './../../common/misc/opq-builder';
import { DeepPartial } from 'src/common/types/deep-partial.type';

@Injectable()
export class CategoryService extends CRUDService<CategoryDocument> {
    constructor(
        @InjectModel('Category')
        private readonly categoryModel: Model<CategoryDocument>,
        @InjectModel('SubCategory')
        private readonly subCategoryModel: Model<SubCategoryDocument>,
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
            throw new AppError(AppErrorTypeEnum.INVALID_RANGE)
        }

        const query = new OPQBuilder()
            .build()

        const docs = await this.categoryModel
            .find(query, null, { skip: (page - 1) * (perPage || 0), limit: perPage })
            .populate('images', 'imageUrl').exec()

        if (!docs) {
            new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return {
            categoryList: docs,
            totalPages: totalPages,
            page: page
        }
    }

    override async getDocumentById(id: string): Promise<CategoryDocument> {
        const doc = await this.categoryModel.findById(id).populate('images').exec()
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }

    override async createDocument(data: Omit<CategoryDocument, keyof Document<unknown, any, any>>): Promise<CategoryDocument> {
        try {
            return await super.createDocument(data)
        } catch(error) {
            await this.imageUploadService.removeMany(data.images.map(id => id.toString()))
            throw error
        }
    }

    override async updateDocumentById(id: string, newData: DeepPartial<CategoryDocument>): Promise<CategoryDocument> {
        const existed = await super.getDocumentById(id)

        for (const image in newData.images) {
            if (!existed.images.includes(
                    // @ts-ignore
                    new mongoose.Types.ObjectId(image)
                )
            ) {
                try {
                    // often images removing by image upload service before calling update function,
                    // becouse image may already be deleted and this image destroy call may crash and we dont care about it
                    await this.imageUploadService.removeDocumentById(image.toString())
                } catch(e) { }
            }
        }

        return await super.updateDocumentById(id, newData)
    }

    override async removeDocumentById(id: string) {
        const doc = await super.getDocumentById(id)

        for (const image of doc.images) {
            await this.imageUploadService.removeDocumentById(image.toString())
        }

        await this.subCategoryModel.deleteMany({ category: id })

        return super.removeDocumentById(id)
    }
}
