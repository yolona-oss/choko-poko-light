import {
    Put,
    Delete,
    Param,
    Body,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import { Response } from 'express'
import { OrdersEntity } from './orders.schema';
import { OrdersService } from './orders.service';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';
import { Role } from './../../common/enums/role.enum';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Public()
    @Get('/')
    async getAllOrders(@Res() response: Response) {
        const ordersDocs = await this.ordersService.getAllDocuments()
        response.json(ordersDocs)
    }

    @Public()
    @Get('/id/:id')
    async getOrderById(@Param('id') id: string, @Res() response: Response) {
        const doc = await this.ordersService.getDocumentById(id)
        response.json(doc)
    }

    @Public()
    @Get('/count')
    async getOrdersCount(@Res() response: Response) {
        const ordersCount = await this.ordersService.getDocumentsCount()
        response.json({
            orderCount: ordersCount
        })
    }

    @Roles(Role.Admin)
    @Post('/create')
    async createNewOrder(@Body() data: OrdersEntity, @Res() response: Response) {
        const doc = await this.ordersService.createDocument(data)
        response.status(200).json(doc)
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    async removeOrderById(@Param('id') id: string, @Res() response: Response) {
        const removedDoc = await this.ordersService.removeDocumentById(id)
        response.json({ success: true, message: "Order deleted" })
    }

    @Roles(Role.Admin)
    @Put('/:id')
    async updateOrderById(
        @Param('id') id: string,
        @Body() data: Partial<OrdersEntity>,
        @Res() response: Response
    ) {
        const updatedDoc = await this.ordersService.updateDocumentById(id, data)
        response.json(updatedDoc)
    }
}
