import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ProductRAMsDocument } from './product-rams.schema';
import { CRUDService } from './../../../internal/crud-service';

@Injectable()
export class ProductRAMsService extends CRUDService<ProductRAMsDocument> {
    constructor(
        @InjectModel('ProductRAMs')
        readonly productRAMsModel: Model<ProductRAMsDocument>
    ) {
        super(productRAMsModel)
    }
}
