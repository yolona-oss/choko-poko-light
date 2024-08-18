import {
    Put,
    Param,
    Query,
    Get,
    Res,
    Controller,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { Response } from 'express'
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @Get('/')
    async getAllCarts(@Res() response: Response) {
        const docs = await this.cartService.findAll()
        response.json(docs)
    }

    @Get('/:userId')
    async getUserCart(
        @Param('userId') userId: string,
        @Res() response: Response
    ) {
        const cart = await this.cartService.findByUser(userId)
        response.json(cart)
    }

    @Get('/:userId/total')
    async totalCartPrice(
        @Param('userId') userId: string,
        @Res() response: Response
    ) {
        const total = await this.cartService.totalCartPrice(userId)
        response.json(total)
    }

    @Put('/:userId/add')
    async addToCart(
        @Param('userId') userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Query('quantity', ParseIntPipe, new DefaultValuePipe(1)) quantity: number,
        @Res() response: Response
    ) {
        const cartProduct = {
            product: productId,
            quantity: quantity
        }
        const cart = await this.cartService.addToCart(userId, cartProduct)
        response.json(cart)
    }

    @Put('/:userId/remove')
    async removeFromCart(
        @Param('userId') userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const cart = await this.cartService.removeFromCart(userId, productId)
        response.json(cart)
    }

    @Put('/:userId/quantity')
    async updateProductQuantity(
        @Param('userId') userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Query('quantity') quantity: number,
        @Res() response: Response
    ) {
        const cart = await this.cartService.changeProductQuantity(userId, productId, quantity)
        response.json(cart)
    }

    @Put('/:userId/clear')
    async clearCart(
        @Param('userId') userId: string,
        @Res() response: Response
    ) {
        const cart = await this.cartService.clearCart(userId)
        response.json(cart)
    }
}
