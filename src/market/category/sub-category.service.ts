import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SubCategoryDocument } from './schemas/sub-category.schema';
import { CRUDService } from './../../internal/crud-service';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';
import { FilteringSubCategoryOptions } from './interfaces/filtring-sub-category-options.interface';
import { OPQBuilder } from 'src/internal/OptionalParamQueryBuilder';
import { FiltredSubCategoryList } from './interfaces/filtred-sub-category.interface';

@Injectable()
export class SubCategoryService extends CRUDService<SubCategoryDocument> {
    constructor(
        @InjectModel('SubCategory')
        readonly subCategoryModel: Model<SubCategoryDocument>
    ) {
        super(subCategoryModel)
    }

    async findFiltredWrapper(opts: FilteringSubCategoryOptions): Promise<FiltredSubCategoryList> {
        const page: number = opts.page ? parseInt(opts.page) : 1
        const perPage = opts.perPage ? parseInt(opts.perPage) : undefined

        const totalDocuments = await this.subCategoryModel.countDocuments()
        const totalPages = +Math.ceil(totalDocuments / (perPage || 1))

        if (totalDocuments === 0) {
            return {
                subCategoryList: [],
                totalPages: 0,
                page: 0
            }
        }

        if (page > totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        const query = new OPQBuilder()
            .build()

        const docs = await this.subCategoryModel.find(query, null,
                                                      { skip: (page - 1) * (perPage || 0), limit: perPage }
                                                     ).populate('category').exec()

        if (!docs) {
            new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        return {
            subCategoryList: docs,
            totalPages: totalPages,
            page: page
        }
    }

    override async getAllDocuments() {
        return await this.subCategoryModel.find().populate("category").exec()
    }
}
