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

    override async updateDocumentById(id: string, data: DeepPartial<HomeBannerDocument>) {
        if (!data.images || data.images.length <= 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        return await super.updateDocumentById(id, {images: data.images})
    }

    override async removeDocumentById(id: string) {
        const entry = await this.homeBannerModel.findById(id)
        if (!entry) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        for (const url of entry.images) {
            await this.imageService.removeConcreetImageFromDefaultCollection(url)
        }

        return await super.removeDocumentById(id)
    }
}
