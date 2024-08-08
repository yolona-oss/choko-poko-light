import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CategoryDocument } from './category.schema';
import { CRUDService } from 'internal/crud-service';

@Injectable()
export class CategoryService extends CRUDService<CategoryDocument> {
    constructor(
        @InjectModel('Category')
        readonly categoryModel: Model<CategoryDocument>
    ) {
        super(categoryModel)
    }
}
