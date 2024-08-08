import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { AppError } from './error/AppError';
import { AppErrorTypeEnum } from './error/AppErrorTypeEnum';

@Injectable()
export abstract class CRUDService<T extends Document> {
    private readonly modelName: string;

    constructor(
        private readonly model: Model<T>
    ) {
        for (const modelName of Object.keys(model.collection.conn.models)) {
            if (model.collection.conn.models[modelName] === this.model) {
                this.modelName = modelName;
                break;
            }
        }
    }

    async findOne(
        conditions: Partial<Record<keyof T, unknown>>,
        projection: string | Record<string, unknown> = {},
        options: Record<string, unknown> = {}
    ): Promise<T|null>
    {
        try {
            return await this.model.findOne(
                conditions as FilterQuery<T>,
                projection,
                options,
            );
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException();
        }
    }

    async getAllDocuments() {
        return await this.model.find().exec()
    }

    async getDocumentsCount() {
        return await this.model.countDocuments()
    }

    async getDocumentById(id: string) {
        const entity = await this.model.findById(id)
        if (!entity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return entity
    }

    async createDocument(data: Omit<T, keyof Document>) {
        const newEntity = await this.model.create(data)
        if (!newEntity) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }
        return newEntity
    }

    async removeDocumentById(id: string) {
        return await this.model.findByIdAndDelete(id)
    }

    async updateDocumentById(id: string, newData: Partial<T>) {
        return await this.model.findByIdAndUpdate(id, newData, { new: true })
    }
}
