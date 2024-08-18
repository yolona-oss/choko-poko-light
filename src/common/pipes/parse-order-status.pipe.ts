import { PipeTransform, Injectable } from '@nestjs/common';
import { OrderStatus } from '../enums/order-status.enum';
import { AppError, AppErrorTypeEnum } from './../app-error';

@Injectable()
export class ParseOrderStatusPipe implements PipeTransform<any, OrderStatus> {
    transform(value: any): OrderStatus {
        if (value === 'pending') {
            return OrderStatus.Pending
        }
        if (value === 'shipped') {
            return OrderStatus.Shipped
        }
        if (value === 'canceled') {
            return OrderStatus.Canceled
        }
        if (value === 'delivered') {
            return OrderStatus.Delivered
        }
        throw new AppError(AppErrorTypeEnum.INVALID_ORDER_STATUS)
    }
}

