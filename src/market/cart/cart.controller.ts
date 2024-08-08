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
import { Cart } from './cart.schema';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @Get()
    async getAllCarts(@Res() response: Response) {
        const execRes = await this.cartService.getAllEntities()
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new NotFoundException("Cannot retrive orders")
    }

    @Get(':id')
    async getCartById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.cartService.getEntityById(id)
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new NotFoundException('The cart with the given ID was not found.')
    }

    @Get('/get/count')
    async getCartsCount(@Res() response: Response) {
        const execRes = await this.cartService.getEntitiesCount()
        if (execRes) {
            response.status(200).json({
                orderCount: execRes // TODO: serialize
            })
        }
        throw new NotFoundException("Cannot retrive carts count")
    }

    @Post('/create')
    async createNewCart(@Body() data: Cart, @Res() response: Response) {
        const execRes = await this.cartService.createEntity(data)
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new BadRequestException("New cart dont created")
    }

    @Delete(':id')
    async removeCartById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.cartService.removeEntityById(id)
        if (execRes) {
            response.status(200).json({ success: true, message: "Cart deleted" })
        }
        throw new NotFoundException("Cart not found")
    }

    @Put(':id')
    async updateOrderById(@Param('id') id: string, @Body() data: Partial<Cart>) { // TODO: create dto for orders 
        const execRes = await this.cartService.updateEntityById(id, data)
    }
}
