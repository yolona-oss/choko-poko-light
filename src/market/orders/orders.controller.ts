import {
    Put,
    Body,
    Query,
    Param,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import { Response } from 'express'

import { OrdersService } from './orders.service';

import { OrderStatus } from './../../common/enums/order-status.enum';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';
import { Role } from './../../common/enums/role.enum';
import { AuthUser } from './../../common/decorators/user.decorator';

import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';
import { ParseOrderStatusPipe } from './../../common/pipes/parse-order-status.pipe';
import { ParseAddressPipe } from './../../common/pipes/parse-address.pipe';
import { ParsePincodePipe } from './../../common/pipes/parse-pincode.pipe';
import { ParsePaymentIdPipe } from './../../common/pipes/parse-payment-id.pipe';
import { IJwtPayload } from 'auth/interfaces/jwt-payload.interface';

@Controller()
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Get('/admin/all')
    async getAll(@Res() response: Response) {
        const ordersDocs = await this.ordersService.findAll()
        response.status(200).json(ordersDocs)
    }

    @Get('/admin/count')
    async getCount(@Res() response: Response) {
        const count = await this.ordersService.findCount()
        response.status(200).json(count)
    }

    // shipped service must set order status by events
    // but now we not have one
    @Put('/admin/:orderId/update-status')
    async udpateOrderStatus(
        @Param('orderId', ParseObjectIdPipe) orderId: string,
        @Query('status', ParseOrderStatusPipe) status: OrderStatus,
        @Res() response: Response
    ) {
        const updated = await this.ordersService.setOrderStatus(orderId, status)
        response.status(200).json(updated)
    }

    @Get('/admin/:orderId')
    async getById(
        @Param('orderId', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const orderDoc = await this.ordersService.findById(id)
        response.status(200).json(orderDoc)
    }

    @Post('/create')
    async createOrder(
        @AuthUser() user: IJwtPayload,
        @Body('address', ParseAddressPipe) address: string,
        @Body('pincode', ParsePincodePipe) pincode: string,
        @Body('paymentId', ParsePaymentIdPipe) paymentId: string,
        @Res() response: Response
    ) {
        const created = await this.ordersService.transfromCart(user.id, {
            address,
            pincode,
            paymentId
        })
        response.status(200).json(created)
    }

    @Get('/')
    async getAllUserOrders(
        @AuthUser() user: IJwtPayload,
        @Query('status') orderStatus: any,
        @Res() response: Response
    ) {
        const orders = await this.ordersService.findSome(user.id, orderStatus)
        response.status(200).json(orders)
    }

    @Get('/count')
    async countUserOrders(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const count = await this.ordersService.findCount(user.id)
        response.status(200).json(count)
    }
}
