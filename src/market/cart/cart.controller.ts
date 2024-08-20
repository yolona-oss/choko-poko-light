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

import { IJwtPayload } from 'auth/interfaces/jwt-payload.interface';
import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';

import { CartService } from './cart.service';

import { AuthUser } from './../../common/decorators/user.decorator';

@Controller()
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @Get('/all')
    async getAllCarts(@Res() response: Response) {
        const docs = await this.cartService.findAll()
        response.status(200).json(docs)
    }

    @Get('/')
    async getUserCart(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const cart = await this.cartService.findByUser(user.id)
        response.status(200).json(cart)
    }

    @Get('/total')
    async totalCartPrice(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const total = await this.cartService.totalCartPrice(user.id)
        response.status(200).json(total)
    }

    @Put('/add')
    async addToCart(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Query('quantity', ParseIntPipe, new DefaultValuePipe(1)) quantity: number,
        @Res() response: Response
    ) {
        const cartProduct = {
            product: productId,
            quantity: quantity
        }
        const cart = await this.cartService.addToCart(user.id, cartProduct)
        response.status(200).json(cart)
    }

    @Put('/remove')
    async removeFromCart(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const cart = await this.cartService.removeFromCart(user.id, productId)
        response.status(200).json(cart)
    }

    @Put('/set-quantity')
    async updateProductQuantity(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Query('quantity', ParseIntPipe, new DefaultValuePipe(1)) quantity: number,
        @Res() response: Response
    ) {
        const cart = await this.cartService.changeProductQuantity(user.id, productId, quantity)
        response.status(200).json(cart)
    }

    @Put('/clear')
    async clearCart(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const cart = await this.cartService.clearCart(user.id)
        response.status(200).json(cart)
    }
}
