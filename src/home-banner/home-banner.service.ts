import mongoose from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { HomeBannerDocument } from './home-banner.schema';
import { CRUDService } from './../internal/crud-service';
import { AppError } from './../internal/error/AppError';
import { AppErrorTypeEnum } from './../internal/error/AppErrorTypeEnum';
import { ImageUploadService } from './../image-upload/image-upload.service';
import { DeepPartial } from './../common/types/deep-partial';

@Injectable()
export class HomeBannerService extends CRUDService<HomeBannerDocument> {
    constructor(
        @InjectModel('HomeBanner')
        private readonly homeBannerModel: Model<HomeBannerDocument>,
        private readonly imageService: ImageUploadService
    ) {
        super(homeBannerModel)
    }

    override async getDocumentById(id: string) {
        try {
            const doc = await this.homeBannerModel.findById(id).populate('images').exec()
            if (!doc) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
            }
            return doc
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
    }

    override async updateDocumentById(id: string, data: DeepPartial<HomeBannerDocument>) {
        if (!data.images || data.images.length <= 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        return await super.updateDocumentById(id, {images: data.images})
    }

    override async removeDocumentById(id: string) {
        const doc = await this.getDocumentById(id)

        for (const image of doc.images) {
            await this.imageService.removeDocumentById(image.toString())
        }

        return await super.removeDocumentById(id)
    }
}
