import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { ProductDocument } from "./products.schema"
import { ProductFilterParams } from "./interfaces/ProductFilterParams"

@Injectable()
export class ProductsFilteringService {
    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
    ) { }

    createFilterQuery(filterOpts: ProductFilterParams) {
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

    async processQuantityOfOutput(page?: string, perPage?: string) {
        const _page = parseInt(page || "1")
        const totalDocuments = await this.productModel.countDocuments();
        if (!perPage) {
            return {
                page: _page,
                perPage: null,
                totalDocuments: totalDocuments,
                totalPages: 1
            }
        }
        const _perPage   = parseInt(perPage)
        const totalPages = +Math.ceil(totalDocuments / _perPage);

        return {
            page: _page,
            perPage: _perPage,
            totalDocuments: totalDocuments,
            totalPages: totalPages
        }
    }
}
