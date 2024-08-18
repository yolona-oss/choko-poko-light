import mongoose from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { ImageUploadService } from './../image-upload/image-upload.service';

import { HomeBannerDocument } from './schemas/home-banner.schema';

import { AppError, AppErrorTypeEnum } from './../common/app-error';
import { DeepPartial } from './../common/types/deep-partial.type';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';

@Injectable()
export class HomeBannerService {
    constructor(
        @InjectModel('HomeBanner')
        private readonly homeBannerModel: Model<HomeBannerDocument>,
        private readonly imageUploadService: ImageUploadService
    ) { }

    async findAll(): Promise<HomeBannerDocument[]> {
        try {
            return await this.homeBannerModel.find().populate('images').exec()
        } catch (error: any) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_READ, {
                errorMessage: JSON.stringify(error.errors, null, 4) || error
            })
        }
    }

    async findById(id: string) {
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

    async createBanner(data: CreateHomeBannerDto) {
        const doc = await this.homeBannerModel.create(data)
        return await doc.populate('images')
    }

    async updateById(id: string, data: UpdateHomeBannerDto) {
        const existed = await this.findById(id)

        for (const image in data.images) {
            // @ts-ignore 
            if (!existed.images.includes(new mongoose.Types.ObjectId(image))) {
                try {
                    // often images removing by image upload service before calling update function,
                    // becouse image may already be deleted and this image destroy call may crash and we dont care about it
                    await this.imageUploadService.removeDocumentById(image.toString())
                } catch(e) { }
            }
        }
        return await this.homeBannerModel.findByIdAndUpdate(id, {images: data.images}, {new: true}).populate('images')
    }

    async removeById(id: string) {
        const doc = await this.homeBannerModel.findById(id)

        if (!doc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        for (const image of doc.images) {
            await this.imageUploadService.removeDocumentById(image.toString())
        }

        return await this.homeBannerModel.findByIdAndDelete(id)
    }
}
