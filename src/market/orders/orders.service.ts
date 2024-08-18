import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CartService } from '../cart/cart.service';

import { OrdersDocument } from './schemas/orders.schema';

import { AppError, AppErrorTypeEnum } from 'src/common/app-error';
import { CartProducts } from '../cart/dto/cart-product.dto';
import { OrderStatus } from './../../common/enums/order-status.enum';
import { ProductEntity } from '../products/schemas/products.schema';
import { PopulateProductInterface } from './interfaces/populate-product.interface';
import { OPQBuilder } from 'src/common/misc/opq-builder';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel('Orders')
        private readonly ordersModel: Model<OrdersDocument>,
        private readonly cartService: CartService
    ) { }

    async findAll() {
        return await this.ordersModel.find().
            populate<{ products: { product: ProductEntity, quantity: number }[] }>({
            path: 'products',
            populate: {
                path: 'product'
            }
        }
        ).exec()
    }

    async findById(id: string) {
        return await this.ordersModel.findById(id).
            populate<{ products: { product: ProductEntity, quantity: number }[] }>({
            path: 'products',
            populate: {
                path: 'product'
            }
        }
        ).exec()
    }

    async findCount(userId?: string) {
        return await this.ordersModel.countDocuments({user: userId})
    }

    async findUsersOrders(userId: string) {
        const orders = await this.ordersModel.find({user: userId})
            .populate<{ products: { product: Document, quantity: number }[] }>({
                path: 'products',
                populate: {
                    path: 'product',
                }
            })
        .exec()
        return orders
    }

    async findUserOrdersByStatus(userId: string, status: OrderStatus) {
        const orders = await this.ordersModel.find({user: userId, status: status})
            .populate<{ products: { product: Document, quantity: number }[] }>({
                path: 'products',
                populate: {
                    path: 'product',
                }
            })
            .exec()
        return orders
    }

    async findUserOrdersWrapper(userId: string, status: any) {
        if (typeof status === 'string') {
            return await this.findUserOrdersByStatus(userId, <any>status)
        } else {
            return await this.findUsersOrders(userId)
        }
    }

    async findUserOrdersCount(userId: string) {
        const count = await this.ordersModel.countDocuments({user: userId})
        return count
    }

    async createOrder(userId: string, products: CartProducts) {
        try {
            const created = await this.ordersModel.create({user: userId, products: products})
            if (!created) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
            }
            return created
        } catch(error: any) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE, {
                errorMessage: "Cart cannot be created " + error?.message,
                userMessage: "Cart cannot be created " + error?.message})
        }
    }

    async setOrderStatus(orderId: string, status: OrderStatus) {
        try {
            const updateData = new OPQBuilder()
                .addToQuery("status", status)
                .addToQuery("closingData", new Date())
                .build()

            return await this.ordersModel.updateOne({_id: orderId}, updateData, {new: true})
                .populate<PopulateProductInterface>({
                    path: 'products',
                    populate: {
                        path: 'product'
                    }
                })
                .exec()
        } catch(e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                {errorMessage: "Order not found", userMessage: "Order not found"})
        }
    }

    async setCompleteOrder(orderId: string) {
        await this.setOrderStatus(orderId, OrderStatus.Delivered)
    }

    async setCancelOrder(orderId: string) {
        return await this.setOrderStatus(orderId, OrderStatus.Canceled)
    }

    async setShippedOrder(orderId: string) {
        return await this.setOrderStatus(orderId, OrderStatus.Shipped)
    }

    async setPendingOrder(orderId: string) {
        return await this.setOrderStatus(orderId, OrderStatus.Pending)
    }

    /***
     * Used only when user deletion
     */
    async removeUserOrders(userId: string) {
        try {
            return await this.ordersModel.deleteMany({user: userId}).exec()
        } catch(e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
                {errorMessage: "Orders not found", userMessage: "Orders not found"})
        }
    }

    /***
     * Transforms user cart to order. Also clears current user cart
     *
     * @param userId - user id's
     */
    async transfromCart(userId: string) {
        const cart = await this.cartService.findByUser(userId)

        if (!cart) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        const cartProducts = cart.products.map((item) => {
            return {
                product: <string>item.product.id,
                quantity: item.quantity
            }
        })
        const created = await this.createOrder(userId, cartProducts)
        await this.cartService.clearCart(userId)
        return created
    }
}
