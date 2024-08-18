import { PipeTransform, Injectable } from '@nestjs/common';
import { AppError, AppErrorTypeEnum } from './../app-error';

@Injectable()
export class ParsePaymentIdPipe implements PipeTransform<any, string> {
    transform(value: any): string {
        return String(value)
    }
}

