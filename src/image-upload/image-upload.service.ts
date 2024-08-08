import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ImageUpload, ImageUploadDocument } from './image-upload.schema';
import { CRUDService } from 'internal/crud-service';
import { CloudinaryService } from 'common/cloudinary/cloudinary.service';
import * as fs from 'fs'

@Injectable()
export class ImageUploadService extends CRUDService<ImageUploadDocument> {
    constructor(
        @InjectModel('ImageUpload')
        private imageUploadModel: Model<ImageUploadDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super(imageUploadModel)
    }

    async removeFromCloudinary(file: string) {
        return await this.cloudinaryService.destroyFile(file)
    }

    async uploadImages(files: Array<Express.Multer.File>) {
        let imagesURL = new Array<string>;
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };
        for (let i = 0; i < files.length; ++i) {
            const img = await this.cloudinaryService.uploadFile(files[i].path, options);
            imagesURL.push(img.secure_url)
            fs.unlinkSync(`uploads/${files[i].filename}`) // TODO: add access by config
        }

        let newEntry = await this.createEntity({images: imagesURL})
        if (!newEntry) {
            // TODO remove from cloudinary
            throw "Cannot uplaod File, database error"
        }
        return imagesURL
    }
}
