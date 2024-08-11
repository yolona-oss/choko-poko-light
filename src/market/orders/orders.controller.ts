import {
    Put,
    Delete,
    Param,
    Body,
    Get,
    Res,
    Controller,
    Post,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { Response } from 'express'
import { OrdersEntity } from './orders.schema';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Get('/')
    async getAllOrders(@Res() response: Response) {
        const ordersDocs = await this.ordersService.getAllDocuments()
        response.json(ordersDocs)
    }

    @Get('/id/:id')
    async getOrderById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.ordersService.getDocumentById(id)
        response.json(execRes)
    }

    @Get('/count')
    async getOrdersCount(@Res() response: Response) {
        const ordersCount = await this.ordersService.getDocumentsCount()
        response.json({
            orderCount: ordersCount
        })
    }

    @Post('/create')
    async createNewOrder(@Body() data: OrdersEntity, @Res() response: Response) {
        const execRes = await this.ordersService.createDocument(data)
        response.status(200).json(execRes)
    }

    @Delete('/:id')
    async removeOrderById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.ordersService.removeDocumentById(id)
        response.json({ success: true, message: "Order deleted" })
    }

    @Put('/:id')
    async updateOrderById(@Param('id') id: string, @Body() data: Partial<OrdersEntity>) { // TODO: create dto for orders 
        const execRes = await this.ordersService.updateDocumentById(id, data)
    }
}
