export interface CartProduct {
    readonly product: string
    readonly quantity: number
}

export type CartProducts = CartProduct[]
