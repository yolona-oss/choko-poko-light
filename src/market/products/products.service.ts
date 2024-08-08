import { Model, Document } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductEntity, ProductDocument } from './products.schema';
import { CRUDService } from 'internal/crud-service';
import { RecentlyViewdService } from './recently-viewd/recently-viewd.service';
import { CategoryService } from 'market/category/category.service';
import { ImageUploadService } from 'image-upload/image-upload.service';
import { AppError } from 'internal/error/AppError';
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { DEFAULT_IMAGES_ENTITY_COLLECTION_NAME } from 'common/constants';
import { ProductFilterParams } from './interfaces/ProductFilterParams';

@Injectable()
export class ProductsService extends CRUDService<ProductDocument> {
    constructor(
        @InjectModel('Product')
        readonly productModel: Model<ProductDocument>,
        readonly recentlyViewdService: RecentlyViewdService,
        private categoryService: CategoryService,
        private imageUploadService: ImageUploadService,
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
                                     async (query) => await this.getAllDocumentsByQuery(query),
                                     async (query, page, perPage) => await this.getEntriesByPage(query, page, perPage))
    }

    async getFiltredRecentlyViewdProducts(filterOpts: ProductFilterParams) {
        return await this.getFiltred(filterOpts,
                                     async (query) => await this.recentlyViewdService.getAllDocumentsByQuery(query),
                                     async (query, page, perPage) => await this.recentlyViewdService.getEntriesByPage(query, page, perPage))
    }

    async createNewEntry(newProduct: ProductEntity) {
        const categoryEntry = await this.categoryService.getDocumentById(
            // @ts-ignore
            newProduct.category
        )

        if (!categoryEntry) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, {
                errorMessage: 'Invalid category',
                userMessage: 'Invalid category'
            })
        }

        for (const image of newProduct.images) {
            const isUploaded = await this.imageUploadService.isImageUploaded(image)
            // TODO remove logs
            console.log("is uploaded: " + isUploaded)
            if (!isUploaded) {
                throw new Error("not uploaded")
            }
        }

        return await super.createDocument(newProduct)
    }

    override async removeDocumentById(id: string) {
        const productEntry = await this.getDocumentById(id)
        if (!productEntry) {
            throw "Product with given ID not found"
        }
        const productImages = productEntry.images

        // TODO for campatibility tables Images and no one other dont bounds((
        for (const image of productImages) {
            try {
                await this.imageUploadService.removeConcreetImageFromEntryByCollectionName(DEFAULT_IMAGES_ENTITY_COLLECTION_NAME, image)
            } catch(e) {
                // dont care its already be in products model before normal images model implements
            }
        }

        return await this.productModel.findByIdAndDelete(id)
    }

    override async getAllDocuments() {
        return await this.productModel.find().populate("category subCat").exec()
    }

    // search func TODO
    async getAllDocumentsByQuery(query: Object) {
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
     * @deprecated Use createNewEntry instead. Execution will throw the error
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
        const pagesQuantity = await this.processQuantityOfOutput(filterOpts.page, filterOpts.perPage)

        if (pagesQuantity.page > pagesQuantity.totalPages) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_RANGE)
        }

        const query = this.createFilterQuery(filterOpts)

        let docs: Document[]|null
        if (pagesQuantity.page && pagesQuantity.perPage) {
            docs = await findByPageFn(query, pagesQuantity.page, pagesQuantity.perPage)
            //docs = await this.getEntriesByPage(query, pagesQuantity.page, pagesQuantity.perPage)
        } else {
            docs = await findFn(query)
            //docs = await this.getAllDocumentsByQuery(query)
        }

        return {
            products: docs || [],
            totalPages: pagesQuantity.totalPages,
            page: pagesQuantity.page
        }
    }

    private createFilterQuery(filterOpts: ProductFilterParams) {
        const {
            minPrice, maxPrice,
            subCategoryId,
            categoryId, categoryName, category,
            rating,
            location,
            isFeatured
        } = filterOpts

        let query: Record<string, any> = {}

        // TODO: add maxPrice handler
        // may be use loop for appending query?
        const queryByPrice         = { price: { $gte: parseInt(<string>minPrice), $lte: parseInt(<string>maxPrice) || 99999999 } }
        const queryByCategoryId    = { category: categoryId || category }
        const queryByCategoryName  = { catName: categoryName }
        const queryBySubCategoryId = { subCatId: subCategoryId }
        const queryByRating        = { rating: rating }
        const queryByLocation      = { location: location }
        const queryByisFeaturing   = { isFeatured: isFeatured }

        if (minPrice)      { Object.assign(query, queryByPrice) }
        if (categoryName)  { Object.assign(query, queryByCategoryName) }
        if (subCategoryId) { Object.assign(query, queryBySubCategoryId) }
        if (rating)        { Object.assign(query, queryByRating) }
        if (location)      { Object.assign(query, queryByLocation) }
        if (categoryId || category) { Object.assign(query, queryByCategoryId) }
        // may be use typeof Boolean?
        if (location !== undefined && location !== null && location !== "All") { // TODO: create enum
            Object.assign(query, queryByLocation)
        }
        if (isFeatured !== undefined && isFeatured !== null) {
            Object.assign(query, queryByisFeaturing)
        }

        return query
    }

    private async processQuantityOfOutput(page?: string, perPage?: string) {
        const _page = parseInt(page || "1")
        const totalDocuments = await this.getDocumentsCount();
        if (!perPage) {
            return {
                page: _page,
                perPage: null,
                totalDocuments: totalDocuments,
                totalPages: 1
            }
        }
        const _perPage = parseInt(perPage)
        const totalPages   = +Math.ceil(totalDocuments / _perPage);

        return {
            page: _page,
            perPage: _perPage,
            totalDocuments: totalDocuments,
            totalPages: totalPages
        }
    }

    private async getEntriesByPage(query: Object, page: number, perPage: number) {
        return await this.productModel
        .find(query)
        .populate("category subCat")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
    }
}
