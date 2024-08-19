import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CartDocument } from './schemas/cart.schema';
import { CartProduct, CartProducts } from './dto/cart-product.dto';
import { AppError, AppErrorTypeEnum } from './../../common/app-error';
import { ProductEntity } from '../products/schemas/products.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel('Cart')
        readonly cartModel: Model<CartDocument>
    ) {}

    async create(userId: string, products: CartProducts = []) {
        try {
            return await this.cartModel.create({user: userId, products: products})
        } catch(error: any) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                errorMessage: "Cart cannot be created " + error?.message,
                userMessage: "Cart cannot be created " + error?.message})
        }
    }

    async removeUserCart(userId: string) {
        try {
            return await this.cartModel.deleteOne({user: userId}).exec()
        } catch(e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                {errorMessage: "Cart not found", userMessage: "Cart not found"})
        }
    }

    async clearCart(userId: string) {
        try {
            return await this.cartModel.updateOne({user: userId}, {products: []}).exec()
        } catch(e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                {errorMessage: "Cart not found", userMessage: "Cart not found"})
        }
    }

    async findAll() {
        return await this.cartModel.find().
            populate<{ products: { product: ProductEntity, quantity: number }[] }>({
                path: 'products',
                populate: {
                    path: 'product'
                }
            })
            .exec()
    }

    async findByUser(userId: string) {
        return await this.cartModel.findOne({customer: userId}).
            populate<{ products: { product: ProductEntity, quantity: number }[] }>({
                path: 'products',
                populate: {
                    path: 'product'
                }
            }).exec()
    }

    async totalCartPrice(userId: string) {
        const cart = await this.findByUser(userId)
        if (!cart) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        if (cart.products.length === 0) {
            return 0
        }

        return cart.products
            .reduce(
                (total, product) =>
                    // @ts-ignore
                    total + product.product.price * product.quantity,
                0
            )
    }

    async addToCart(userId: string, product: CartProduct) {
        try {
            const res = await this.cartModel.updateOne({customer: userId},
                { $addToSet: { products: product } },
                { new: true })
                .populate<{ products: { product: ProductEntity, quantity: number }[] }>({
                    path: 'products',
                    populate: {
                        path: 'product'
                    }
                }).exec()

            return res
        } catch (error) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }
    }

    async removeFromCart(userId: string, productId: string) {
        try {
            const res = await this.cartModel.updateOne({customer: userId},
                { $pull: { products: { product: productId } } },
                { new: true })
                .populate<{ products: { product: ProductEntity, quantity: number }[] }>({
                    path: 'products',
                    populate: {
                        path: 'product'
                    }
                }).exec()

            return res
        } catch (error) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }
    }

    async changeProductQuantity(userId: string, productId: string, quantity: number) {
        try {
            const res = await this.cartModel.updateOne({customer: userId },
                { $set: { "products.$[elem].quantity": quantity } },
                { arrayFilters: [ { elem: {product: productId } } ], new: true })
                .populate<{ products: { product: ProductEntity, quantity: number }[] }>({
                    path: 'products',
                    populate: {
                        path: 'product'
                    }
                }).exec()

            return res
        } catch (error) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }
    }
}
