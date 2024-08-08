import { Document, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { RecentlyViewd, RecentlyViewdDocument } from './recently-viewd.schema';
import { CRUDService } from 'internal/crud-service';
import { PartialBy } from 'internal/utils';

//type SomeIt<Omit<T, keyof Document>>

@Injectable()
export class RecentlyViewdService extends CRUDService<RecentlyViewdDocument> {
    constructor(
        @InjectModel('RecentlyViewd')
        readonly recentlyViewdModel: Model<RecentlyViewdDocument>
    ) {
        super(recentlyViewdModel)
    }

    //async createEntry(data: PartialBy<RecentlyViewd, 'dateCreated'>) {
    //    return this.recentlyViewdModel.create(data)
    //}

    override async getAllEntities() {
        return await this.recentlyViewdModel.find().populate("category subCat").exec()
    }

    async getAllEntriesByQuery(query: Object) {
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
