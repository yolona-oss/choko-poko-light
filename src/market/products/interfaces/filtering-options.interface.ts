export interface FilteringOptions {
    readonly page?: string,
    readonly perPage?: string,

    readonly minPrice?: string,
    readonly maxPrice?: string,
    readonly subCategory?: string,
    readonly category?: string,
    readonly rating?: number,
    readonly location?: string,
    readonly isFeatured?: boolean
}
