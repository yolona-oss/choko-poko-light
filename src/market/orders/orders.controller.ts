import {
    Put,
    Query,
    Param,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import { Response } from 'express'

import { OrdersService } from './orders.service';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';
import { Role } from './../../common/enums/role.enum';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { OrderStatus } from './../../common/enums/order-status.enum';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { ParseOrderStatusPipe } from 'src/common/pipes/parse-order-status.pipe';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Get('/')
    async getAll(@Res() response: Response) {
        const ordersDocs = await this.ordersService.findAll()
        response.json(ordersDocs)
    }

    @Get('/count')
    async getCount(@Res() response: Response) {
        const count = await this.ordersService.findCount()
        response.json(count)
    }

    @Get('/:id')
    async getById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const orderDoc = await this.ordersService.findById(id)
        response.json(orderDoc)
    }

    @Post('/user/:userId/create-order')
    async createOrder(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Res() response: Response
    ) {
        const created = await this.ordersService.transfromCart(userId)
        response.json(created)
    }

    @Get('/user/:userId')
    async getAllUserOrders(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Query('status') orderStatus: any,
        @Res() response: Response
    ) {
        const orders = await this.ordersService.findUserOrdersWrapper(userId, orderStatus)
        response.json(orders)
    }

    @Get('/user/:userId/count')
    async countUserOrders(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Res() response: Response
    ) {
        const count = await this.ordersService.findCount(userId)
        response.json(count)
    }

    // shipped service must set order status by events
    // but now we not have one
    @Post('/:orderId/update-status')
    async udpateOrderStatus(
        @Param('orderId', ParseObjectIdPipe) orderId: string,
        @Query('status', ParseOrderStatusPipe) status: OrderStatus,
        @Res() response: Response
    ) {
        const updated = await this.ordersService.setOrderStatus(orderId, status)
        response.json(updated)
    }
}
