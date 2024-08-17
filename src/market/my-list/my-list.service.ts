import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';

import { FindInListQuery } from './interfaces/find-query.interface';
import { AddToListQuery, RemoveFromListQuery } from './interfaces/list-operation-query.interface';
import { OPQBuilder } from './../../common/misc/opq-builder';

import { MyListDocument } from './schemas/my-list.schema';

import { AppError, AppErrorTypeEnum } from './../../common/app-error';


@Injectable()
export class MyListService {
    constructor(
        @InjectModel('MyList')
        private readonly myListModel: Model<MyListDocument>,
    ) {}

    async findById(id: string) {
        const doc = await this.myListModel.findById(id).populate('products').populate('user').exec()
        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return doc
    }

    async findAll(): Promise<MyListDocument[]> {
        const docs = await this.myListModel.find().populate('products').populate('user').exec()
        if (!docs) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return docs
    }

    async findCount() {
        const count = await this.myListModel.countDocuments()
        return count
    }

    async findUserList(userId: string): Promise<MyListDocument> {
        if (!isValidObjectId(userId)) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_OBJECT_ID)
        }
        const userList = await this.myListModel.findOne({ user: userId }).exec()
        if (!userList) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return await userList.populate('products')
    }

    async findFiltredWrapper(query: FindInListQuery): Promise<MyListDocument[]> {
        const dbQuery = new OPQBuilder()
            .from({})
            .addToQuery('user', query.user)
            .addToQuery('products', query.product)
            .build()

        const docs = await this.myListModel.find(dbQuery).populate('products').populate('user').exec()
        if (!docs) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return docs
    }

    async create(userId: string, productIds: string[]) {
        const created = await this.myListModel.create({user: userId, products: productIds})
        if (!created) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }
        return created
    }

    async addToUser(opts: AddToListQuery) {
        const updated = await this.myListModel.findOneAndUpdate({ user: opts.userId }, {
            $addToSet: {
                // @ts-ignore
                products: new mongoose.Types.ObjectId(opts.productId)
            }
        }, { new: true })

        if (!updated) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }

        return await updated.populate('products')
    }

    async removeFromUser(opts: RemoveFromListQuery) {
        const updated = await this.myListModel.findOneAndUpdate({ user: opts.userId }, {
            $pull: {
                // @ts-ignore
                products: new mongoose.Types.ObjectId(opts.productId)
            }
        }, { new: true })

        if (!updated) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }

        return await updated.populate('products')
    }

    async removeUserList(userId: string) {
        const deleted = await this.myListModel.findOneAndDelete({ user: userId })
        if (!deleted) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_DELETE)
        }
        return deleted
    }
}
