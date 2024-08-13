import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { RecentlyViewdDocument } from './recently-viewd.schema';
import { CRUDService } from './../../../internal/crud-service';

@Injectable()
export class RecentlyViewdService extends CRUDService<RecentlyViewdDocument> {
    constructor(
        @InjectModel('RecentlyViewd')
        readonly recentlyViewdModel: Model<RecentlyViewdDocument>
    ) {
        super(recentlyViewdModel)
    }

    override async getAllDocuments() {
        return await this.recentlyViewdModel.find().populate("category subCat").exec()
    }

    async getAllDocumentsByQuery(query: Object) {
        return await this.recentlyViewdModel.find(query).populate("category subCat").exec()
    }

    async getEntriesByPage(query: Object, page: number, perPage: number) {
        return await this.recentlyViewdModel
        .find(query)
        .populate("category subCat")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
    }
}
