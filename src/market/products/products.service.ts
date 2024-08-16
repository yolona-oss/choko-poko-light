import mongoose, { Model, FilterQuery, isValidObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryService } from './../category/category.service';
import { ImageUploadService } from './../../image-upload/image-upload.service';

import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

import { CreateProductDto } from './dto/create-product.dto';

import { ProductDocument } from './schemas/products.schema';
import { CategoryEntity } from './../category/schemas/category.schema';
import { SubCategoryEntity } from '../category/schemas/sub-category.schema';
import { ProductEntity } from './schemas/products.schema';
import { ImagesEntity } from './../../image-upload/image-upload.schema';

import { OPQBuilder } from 'src/internal/OptionalParamQueryBuilder';
import { FilteringOptions } from './interfaces/filtering-options.interface';
import { FiltredProducts } from './interfaces/filtred-products.interface';

//import { CRUDService } from './../../internal/crud-service';

import { DeepPartial } from './../../common/types/deep-partial';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Product')
        private readonly model: Model<ProductDocument>,
        private readonly category: CategoryService,
        private readonly imagesService: ImageUploadService,
    ) { }

    async findAll() {
        return (await this.model.find()
                .populate<CategoryEntity>("category")
                .populate<SubCategoryEntity>("subCategory").exec()) || []
    }

    async findById(id: string) {
        const doc = await this.model.findById(id)
        .populate<{ category: CategoryEntity }>("category")
        .populate<{ subCategory: SubCategoryEntity }>("subCategory")
        .populate<{ images: ImagesEntity[] }>("images")
        .exec()
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }

    async findOne(query: Partial<Record<keyof ProductDocument, unknown>>) {
        return (await this.model.find(query as FilterQuery<ProductDocument>)
                .populate<CategoryEntity>("category")
                .populate<SubCategoryEntity>("subCategory")
                .exec())
    }

    async findFiltredWrapper(opts: FilteringOptions): Promise<FiltredProducts> {
        const page: number = opts.page ? parseInt(opts.page) : 1
        const perPage = opts.perPage ? parseInt(opts.perPage) : undefined

        const totalDocuments = await this.model.countDocuments()
        const totalPages = +Math.ceil(totalDocuments / (perPage || 1))

        if (totalDocuments === 0) {
            return {
                products: [],
                totalPages: 0,
                page: 0
            }
        }

        if (page > totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        const query = new OPQBuilder()
            .addToQuery("price", opts.minPrice, (v) => {
                return { $gte: parseInt(v) }
            })
            .addToQuery("price", opts.maxPrice, (v) => {
                return { $lte: parseInt(v) }
            })
            .addToQuery("rating", opts.rating)
            .addToQuery("category", opts.category, null, (v) => isValidObjectId(v))
            .addToQuery("subCategory", opts.subCategory, null, (v) => isValidObjectId(v))
            .addToQuery("location", opts.location)
            .addToQuery("isFeatured", opts.isFeatured, null, (v) => typeof v === 'boolean')
            .build()

        const docs = await this.model.find(query, null, { skip: (page - 1) * (perPage || 0), limit: perPage }).
            populate<{ category: CategoryEntity }>('category').
            populate<{ subCategory: SubCategoryEntity }>('subCategory').exec()

        return {
            products: docs,
            totalPages: totalPages,
            page: page
        }
    }

    async productsCount() {
        return await this.model.countDocuments()
    }

    async search(query: any) {
        query
        return null
    }

    async create(newProduct: CreateProductDto) {
        const categoryEntry = await this.category.getDocumentById(
            newProduct.category
        )

        if (!categoryEntry) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, {
                errorMessage: 'Cannot create product: invalid category submitted',
                userMessage: 'Cannot create product: invalid category submitted'
            })
        }

        try {
            return await this.model.create(newProduct)
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new AppError(AppErrorTypeEnum.DB_VALIDATION_ERROR, {
                    errorMessage: 'Cannot create product: invalid data submitted: ' + error.message,
                    userMessage: 'Cannot create product: invalid data submitted: ' + error.message
                })
            }
            throw error
        }
    }

    async remove(id: string) {
        try {
            const existed = await this.model.findById(id)
            if (!existed) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
            }

            if (existed.images) {
                await this.imagesService.removeMany(
                    existed.images.map(objId => objId.toString())
                )
            }

            const deleted = await this.model.findByIdAndDelete(id)
            if (!deleted) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
            }
            return deleted
        } catch(e) {
            throw e
        }
    }

    async update(id: string, newData: DeepPartial<ProductEntity>) {
        const doc = await this.model.findByIdAndUpdate(id, newData, { new: true })
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }
}
