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
import { Orders } from './orders.schema';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Get('/')
    async getAllOrders(@Res() response: Response) {
        const execRes = await this.ordersService.getAllEntities()
        if (execRes) {
            response.status(200).json(execRes)
        } else {
            throw new NotFoundException("Cannot retrive orders")
        }
    }

    @Get('/id/:id')
    async getOrderById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.ordersService.getEntityById(id)
        if (execRes) {
            response.status(200).json(execRes)
        } else {
            throw new NotFoundException('The order with the given ID was not found.')
        }
    }

    @Get('/count')
    async getOrdersCount(@Res() response: Response) {
        const execRes = await this.ordersService.getEntitiesCount()
        if (execRes) {
            response.status(200).json({
                orderCount: execRes // TODO: serialize
            })
        } else {
            throw new NotFoundException("Cannot retrive orders count")
        }
    }

    @Post('/create')
    async createNewOrder(@Body() data: Orders, @Res() response: Response) {
        const execRes = await this.ordersService.createEntity(data)
        if (execRes) {
            response.status(200).json(execRes)
        } else {
            throw new BadRequestException("New order dont created")
        }
    }

    @Delete('/:id')
    async removeOrderById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.ordersService.removeEntityById(id)
        if (execRes) {
            response.status(200).json({ success: true, message: "Order deleted" })
        } else {
            response.status(404).json({ success: false, message: "Order not found"})
        }
    }

    @Put('/:id')
    async updateOrderById(@Param('id') id: string, @Body() data: Partial<Orders>) { // TODO: create dto for orders 
        const execRes = await this.ordersService.updateEntityById(id, data)
    }
}
