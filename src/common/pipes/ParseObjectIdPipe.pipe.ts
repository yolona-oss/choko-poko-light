import { PipeTransform, Injectable } from '@nestjs/common';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
    transform(value: any): Types.ObjectId {
        const validObjectId = Types.ObjectId.isValid(value);

        if (!validObjectId) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_OBJECT_ID)
        }

        return Types.ObjectId.createFromHexString(value);
    }
}
