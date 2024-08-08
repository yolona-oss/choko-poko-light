import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SubCategoryDocument } from './sub-category.schema';
import { CRUDService } from 'internal/crud-service';

@Injectable()
export class SubCategoryService extends CRUDService<SubCategoryDocument> {
    constructor(
        @InjectModel('SubCategory')
        readonly subCategoryModel: Model<SubCategoryDocument>
    ) {
        super(subCategoryModel)
    }
}
