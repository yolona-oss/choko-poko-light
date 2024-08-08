import { Model, Document } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './products.schema';
import { CRUDService } from 'internal/crud-service';
import { RecentlyViewdService } from './recently-viewd/recently-viewd.service';
import { CategoryService } from 'market/category/category.service';
import { SubCategoryService } from 'market/category/sub-category.service';
import { ImageUploadService } from 'image-upload/image-upload.service';
import { extractFileName } from 'internal/utils';
import { CloudinaryService } from 'common/cloudinary/cloudinary.service'
import { AppError } from 'internal/error/AppError';
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { DEFAULT_IMAGES_ENTITY_COLLECTION_NAME } from 'common/constants';

export interface ProductFilterParams {
        page?: string,
        perPage?: string,
        minPrice?: string,
        maxPrice?: string, // TODO ask vlad for max of max value
        subCategoryId?: string, // subCatId
        categoryId?: string, // catId
        category?: string, // catId
        categoryName?: string, // catName
        rating?: number,
        location?: string,
        isFeatured?: boolean
}

// TODO: use values form providers, that reads from ConfigService
export const defaultsProductFilterParams: Pick<ProductFilterParams, 'page' | 'perPage'> = {
    page: "1",
    perPage: "-1"
}

@Injectable()
export class ProductsService extends CRUDService<ProductDocument> {
    constructor(
        @InjectModel('Product')
        readonly productModel: Model<ProductDocument>,
        readonly recentlyViewdService: RecentlyViewdService,

        private categoryService: CategoryService,
        private subCategoryService: SubCategoryService,

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
        const queryByCategoryId    = { catId: categoryId || category }
        const queryByCategoryName  = { catName: categoryName }
        const queryBySubCategoryId = { subCatId: subCategoryId }
        const queryByRating        = { rating: rating }
        const queryByLocation      = { location: location }
        const queryByisFeaturing   = { isFeatured: isFeatured }

        if (minPrice)      { Object.assign(queryByPrice, query) }
        if (categoryId)    { Object.assign(queryByCategoryId, query) }
        if (categoryName)  { Object.assign(queryByCategoryName, query) }
        if (subCategoryId) { Object.assign(queryBySubCategoryId, query) }
        if (rating)        { Object.assign(queryByRating, query) }
        if (location)      { Object.assign(queryByLocation, query) }
        // may be use typeof Boolean?
        if (isFeatured !== undefined || isFeatured !== null || isFeatured !== "All") { // TODO: create enum
            Object.assign(queryByisFeaturing, query)
        }

        console.log(query)

        return query
    }

    private async processQuantityOfOutput(page?: string, perPage?: string) {
        const _page = parseInt(<string>page)
        const _perPage = parseInt(<string>perPage)

        const totalEntries = await this.getEntitiesCount();
        const totalPages   = +Math.ceil(totalEntries / _perPage);

        return {
            page: _page,
            perPage: _perPage,
            totalEntries: totalEntries,
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

    // by cat 
    // by subCat 
    // by rating 
    // by location
    // by rating
    async getFiltredProducts(filterOpts: ProductFilterParams) {
        const pagesQuantity = await this.processQuantityOfOutput(filterOpts.page, filterOpts.perPage)

        if (pagesQuantity.page > pagesQuantity.totalPages) {
            throw "Page not found"
        }

        const query = this.createFilterQuery(filterOpts)

        // TODO: try use find(query, null, {limit: x, skip: y})
        let entries = []
        if (pagesQuantity.page && (pagesQuantity.perPage > 0)) {
            entries = await this.getEntriesByPage(query, pagesQuantity.page, pagesQuantity.perPage)
        } else {
            entries = await this.getAllEntriesByQuery(query)
        }

        return {
            products: entries,
            totalPages: pagesQuantity.totalPages,
            page: pagesQuantity.page
        }
    }

    async getFiltredRecentlyViewdProducts(filterOpts: ProductFilterParams) {
        const pagesQuantity = await this.processQuantityOfOutput(filterOpts.page, filterOpts.perPage)

        if (pagesQuantity.page > pagesQuantity.totalPages) {
            throw "Page not found"
        }

        const query = this.createFilterQuery(filterOpts)

        // TODO: try use find(query, null, {limit: x, skip: y})
        let entries = []
        if (pagesQuantity.page && (pagesQuantity.perPage > 0)) {
            entries = await this.recentlyViewdService.getEntriesByPage(query, pagesQuantity.page, pagesQuantity.perPage)
        } else {
            entries = await this.recentlyViewdService.getAllEntriesByQuery(query)
        }

        return {
            products: entries,
            totalPages: pagesQuantity.totalPages,
            page: pagesQuantity.page
        }
    }

    async createNewEntry(newProduct: Product) {
        const categoryEntry = await this.categoryService.getAllEntities()

        if (!categoryEntry) {
            throw "Invalid category"
        }

        const images = new Array<String>
        const imageUploadEntries = await this.imageUploadService.getAllEntities()
        const _images = imageUploadEntries?.map((item: {images: string[], id: string}) => {
            item.images?.map((image: string) => {
                images.push(image);
                //console.log(image)
            })
        })

        return await super.createEntity(newProduct)
    }

    override async removeEntityById(id: string) {
        const productEntry = await this.getEntityById(id)
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

    override async getAllEntities() {
        return await this.productModel.find().populate("category subCat").exec()
    }

    // search func TODO
    async getAllEntriesByQuery(query: Object) {
        return await this.productModel.find(query).populate("category subCat").exec()
    }

    override async getEntityById(id: string) {
        const entity = await this.productModel.findById(id).populate("category subCat").exec()
        if (!entity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return entity
    }

    /**
     * @deprecated Use createNewEntry instead. Execution will throw the error
     */
    override async createEntity(data: Omit<ProductDocument, keyof Document>) {
        throw new Error("Use ProductsService::createNewEntry instead. createEntry not valid")
        return await super.createEntity(data)
    }
}
