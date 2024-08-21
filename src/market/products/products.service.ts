import mongoose, { Model, FilterQuery, isValidObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryService } from './../category/category.service';
import { ImageUploadService } from './../../image-upload/image-upload.service';

import { AppError, AppErrorTypeEnum } from './../../common/app-error';

import { CreateProductDto } from './dto/create-product.dto';

import { ProductDocument } from './schemas/products.schema';
import { ProductEntity } from './schemas/products.schema';

import { OPQBuilder } from './../../common/misc/opq-builder';
import { FilteringOptions } from './interfaces/filtering-options.interface';
import { FiltredProducts } from './interfaces/filtred-products.interface';

import { DeepPartial } from './../../common/types/deep-partial.type';

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
                .populate('images')
                .populate("category")
                .populate("subCategory").exec()) || []
    }

    async findById(id: string) {
        const doc = await this.model.findById(id)
        .populate("category")
        .populate("subCategory")
        .populate("images")
        .exec()
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }

    async findOne(query: Partial<Record<keyof ProductDocument, unknown>>) {
        return (await this.model.find(query as FilterQuery<ProductDocument>)
                .populate('images')
                .populate("category")
                .populate("subCategory")
                .exec())
    }

    async findFiltred(opts: FilteringOptions): Promise<FiltredProducts> {
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
            throw new AppError(AppErrorTypeEnum.INVALID_RANGE)
        }

        const query = new OPQBuilder()
            .addValidatorForKey("category", (v) => isValidObjectId(v))
            .addValidatorForKey("subCategory", (v) => isValidObjectId(v))
            .addValidatorForKey("isFeatured", (v) => (v === 'true' || v === 'false'))
            .addToQuery("price", opts.minPrice, (v) => { return { $gte: parseInt(v) } })
            .addToQuery("price", opts.maxPrice, (v) => { return { $lte: parseInt(v) } })
            .addToQuery("rating", opts.rating)
            .addToQuery("category", opts.category)
            .addToQuery("subCategory", opts.subCategory)
            .addToQuery("location", opts.location, (v) => { return v === "All" ? "" : v })
            .addToQuery("isFeatured", opts.isFeatured, (v) => Boolean(v))
            .build()

        //console.log("Builded Query: " + JSON.stringify(query, null, 4))

        const docs = await this.model.find(query, null, { skip: (page - 1) * (perPage || 0), limit: perPage })
            .populate('images')
            .populate('category')
            .populate('subCategory').exec()

        return {
            products: docs,
            totalPages: totalPages,
            page: page
        }
    }

    async productsCount() {
        return await this.model.countDocuments()
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
                throw new AppError(AppErrorTypeEnum.VALIDATION_ERROR, {
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
            .populate('images')
            .populate('category')
            .populate('subCategory')
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }
}
