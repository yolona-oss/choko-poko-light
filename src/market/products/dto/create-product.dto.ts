//import mongoose from "mongoose"

export interface CreateProductDto {
    readonly name: string
    readonly description: string
    readonly price: number
    readonly oldPrice?: number
    readonly brand?: string
    readonly subCatId?: string
    readonly catId?: string
    readonly catName?: string
    readonly category: string // mongoose.Schema.Types.ObjectId
    readonly subCat: string // mongoose.Schema.Types.ObjectId
    readonly countInStock: number
    readonly rating?: number
    readonly isFeatured?: boolean
    readonly discount?: number
    readonly productRam?: string[]
    readonly size?: string[]
    readonly productWeight?: string[]
    readonly location?: string
    readonly images: string[]
}
