import mongoose, { Model, Document } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductDocument } from './products.schema';
import { CRUDService } from './../../internal/crud-service';
import { RecentlyViewdService } from './recently-viewd/recently-viewd.service';
import { CategoryService } from './../category/category.service';
import { ImageUploadService } from './../../image-upload/image-upload.service';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';
import { ProductFilterParams } from './interfaces/ProductFilterParams';
import { ProductsFilteringService } from './products-filter.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService extends CRUDService<ProductDocument> {
    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
        private readonly categoryService: CategoryService,
        private readonly imageUploadService: ImageUploadService,
        private readonly filtering: ProductsFilteringService,

        readonly recentlyViewdService: RecentlyViewdService,
    ) {
        super(productModel)
    }

    // Used for search module, may be move?
    async searchFunc(query: any) {
        const items = await this.productModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } },
            ]
        }).exec()
        return items;
    }

    async getFiltredProducts(filterOpts: ProductFilterParams) {
        return await this.getFiltred(filterOpts,
                                     async (query) => await this.getDocumentsByQuery(query),
                                         async (query, page, perPage) => await this.getDocumentsByPage(query, page, perPage))
    }

    async getFiltredRecentlyViewdProducts(filterOpts: ProductFilterParams) {
        return await this.getFiltred(filterOpts,
                                     async (query) => await this.recentlyViewdService.getAllDocumentsByQuery(query),
                                         async (query, page, perPage) => await this.recentlyViewdService.getEntriesByPage(query, page, perPage))
    }

    async createNewProduct(newProduct: CreateProductDto) {
        const categoryEntry = await this.categoryService.getDocumentById(
            newProduct.category
        )

        if (!categoryEntry) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, {
                errorMessage: 'Cannot create product: invalid category submitted',
                userMessage: 'Cannot create product: invalid category submitted'
            })
        }

        for (const image of newProduct.images) {
            const isUploaded = await this.imageUploadService.isImageUploaded(image)
            if (!isUploaded) {
                throw new AppError(AppErrorTypeEnum.IMAGE_NOT_UPLOADED)
            }
        }

        try {
            return await this.productModel.create(newProduct)
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new AppError(AppErrorTypeEnum.DB_VALIDATION_ERROR, {
                    errorMessage: 'Cannot create product: invalid data submitted',
                    userMessage: 'Cannot create product: invalid data submitted'
                })
            }
            throw error
        }
        //return await super.createDocument(newProduct)
    }

    override async removeDocumentById(id: string) {
        await this.imageUploadService.removeImagesFromModelById(this.productModel, id)

        try {
            const deleted = await this.productModel.findByIdAndDelete(id)
            if (!deleted) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
            }
            return deleted
        } catch(e) {
            throw e
        }
    }

    override async getAllDocuments() {
        return await this.productModel.find().populate("category subCat").exec()
    }

    // search func TODO
    async getDocumentsByQuery(query: Object) {
        return await this.productModel.find(query).populate("category subCat").exec()
    }

    override async getDocumentById(id: string) {
        const doc = await this.productModel.findById(id).populate("category subCat").exec()
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }

    /**
     * @deprecated Use createNewProduct instead. Execution will throw the error
     */
    override async createDocument(data: Omit<ProductDocument, keyof Document>) {
        throw new Error("Use ProductsService::createNewEntry instead. createEntry not valid")
        return await super.createDocument(data)
    }

    private async getFiltred(
        filterOpts: ProductFilterParams,
        findFn: (query: any) => Promise<Document[]|null>,
            findByPageFn: (query: any, page: number, perPage: number) => Promise<Document[]|null>
    ) {
        const pagesQuantity = await this.filtering.processQuantityOfOutput(filterOpts.page, filterOpts.perPage)

        if (pagesQuantity.page > pagesQuantity.totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        const query = this.filtering.createFilterQuery(filterOpts)

        let docs: Document[]|null
        if (pagesQuantity.page && pagesQuantity.perPage) {
            docs = await findByPageFn(query, pagesQuantity.page, pagesQuantity.perPage)
        } else {
            docs = await findFn(query)
        }

        return {
            products: docs || [],
            totalPages: pagesQuantity.totalPages,
            page: pagesQuantity.page
        }
    }

    private async getDocumentsByPage(query: Object, page: number, perPage: number) {
        return await this.productModel
        .find(query)
        .populate("category subCat")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
    }
}
