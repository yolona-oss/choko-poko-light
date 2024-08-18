import { ProductEntity } from './../../products/schemas/products.schema';

export interface PopulateProductInterface {
    products: {
        product: ProductEntity,
        quantity: number
    }
}
