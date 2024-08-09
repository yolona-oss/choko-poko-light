import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HomeBannerDocument } from './home-banner.schema';
import { CloudinaryService } from 'common/cloudinary/cloudinary.service';
//import { CloudinaryService } from 'nestjs-cloudinary'
import { extractFileName } from 'internal/utils';
import { CRUDService } from 'internal/crud-service';
import { AppError } from 'internal/error/AppError';
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { ImageUploadService } from 'image-upload/image-upload.service';

@Injectable()
export class HomeBannerService extends CRUDService<HomeBannerDocument> {
    constructor(
        @InjectModel('HomeBanner')
        private readonly homeBannerModel: Model<HomeBannerDocument>,
        private readonly imageService: ImageUploadService
    ) {
        super(homeBannerModel)
    }

    override async updateDocumentById(id: string, hbData: Partial<HomeBannerDocument>) {
        if (!hbData.images || hbData.images.length <= 0) {
            throw new AppError(AppErrorTypeEnum.DB_NOTHING_TO_UPDATE)
        }

        return await this.homeBannerModel.findByIdAndUpdate(id, {images: hbData.images}, { new: true })
    }

    override async removeDocumentById(id: string) {
        const entry = await this.homeBannerModel.findById(id)
        if (!entry) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        const imagesUrl = entry.images;

        for (const url of imagesUrl) {
            await this.imageService.removeConcreetImageFromDefaultCollection(url)
        }

        return await this.homeBannerModel.findByIdAndDelete(id)
    }
}
