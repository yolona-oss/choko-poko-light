import {
    Put,
    Delete,
    Param,
    Query,
    Body,
    Get,
    Res,
    Controller,
    Post,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { Response } from 'express'
import { CartEntity } from './cart.schema';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @Get()
    async getAllCarts(@Res() response: Response) {
        const execRes = await this.cartService.getAllDocuments()
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new NotFoundException("Cannot retrive orders")
    }

    @Get(':id')
    async getCartById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.cartService.getDocumentById(id)
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new NotFoundException('The cart with the given ID was not found.')
    }

    @Get('/get/count')
    async getCartsCount(@Res() response: Response) {
        const execRes = await this.cartService.getDocumentsCount()
        if (execRes) {
            response.status(200).json({
                orderCount: execRes // TODO: serialize
            })
        }
        throw new NotFoundException("Cannot retrive carts count")
    }

    @Post('/create')
    async createNewCart(@Body() data: CartEntity, @Res() response: Response) {
        const execRes = await this.cartService.createDocument(data)
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new BadRequestException("New cart dont created")
    }

    @Delete(':id')
    async removeCartById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.cartService.removeDocumentById(id)
        if (execRes) {
            response.status(200).json({ success: true, message: "Cart deleted" })
        }
        throw new NotFoundException("Cart not found")
    }

    @Put(':id')
    async updateOrderById(@Param('id') id: string, @Body() data: Partial<CartEntity>) { // TODO: create dto for orders 
        const execRes = await this.cartService.updateDocumentById(id, data)
    }
}
