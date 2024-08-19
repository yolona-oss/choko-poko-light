//import mongoose from "mongoose"

export interface CreateProductDto {
    readonly name: string
    readonly description: string
    readonly price: number
    readonly oldPrice?: number
    readonly brand?: string
    readonly subCategory?: string
    readonly category: string
    readonly countInStock: number
    readonly rating?: number
    readonly isFeatured?: boolean
    readonly discount?: number
    readonly rams?: string[]
    readonly size?: string[]
    readonly weight?: string[]
    readonly location?: string
    readonly images: string[]
}
