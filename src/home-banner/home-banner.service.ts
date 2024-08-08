import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HomeBannerDocument } from './home-banner.schema';
import { CloudinaryService } from 'common/cloudinary/cloudinary.service';
//import { CloudinaryService } from 'nestjs-cloudinary'
import { extractFileName } from 'internal/utils';

@Injectable()
export class HomeBannerService {
    constructor(
        @InjectModel('HomeBanner')
        private readonly homeBannerModel: Model<HomeBannerDocument>,
        private cloudinaryService: CloudinaryService
    ) {}

    async getAll() {
        return await this.homeBannerModel.find().exec()
    }

    async getById(id: string) {
        return await this.homeBannerModel.findById(id)
    }

    async create(images: string[]) {
        return await this.homeBannerModel.create({
            images: images
        })
    }

    async updateById(id: string, images: string[]) {
        if (images.length <= 0) {
            throw "Cannot update" //TODO
        }

        return await this.homeBannerModel.findByIdAndUpdate(id, { images: images }, { new: true })
    }

    async removeById(id: string) {
        const entry = await this.homeBannerModel.findById(id)
        if (!entry) {
            throw "Cannot retrive data from model"
        }
        const imagesUrl = entry.images;

        for (const url of imagesUrl) {
            await this.removeFromCloudinary(extractFileName(url))
        }

        return await this.homeBannerModel.findByIdAndDelete(id)
    }

    async removeFromCloudinary(fileName: string) {
        return await this.cloudinaryService.destroyFile(fileName)
    }
}
