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
