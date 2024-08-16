import mongoose, { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs'

import { CloudinaryService } from './../common/cloudinary/cloudinary.service';

import { ImagesDocument } from './schemas/image-upload.schema';

import { CRUDService } from './../common/misc/crud-service';
import { AppError, AppErrorTypeEnum } from './../common/app-error';
import { extractFileName } from './../common/misc/utils';

@Injectable()
export class ImageUploadService extends CRUDService<ImagesDocument> {
    constructor(
        @InjectModel('Images')
        private imagesModel: Model<ImagesDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super(imagesModel)
    }

    async uploadImages(files: Array<Express.Multer.File>) {
        const cloudinaryUploadedUrls = new Array<string>;
        const imageDocs = new Array<ImagesDocument>;

        const cloudinaryUploadOptions = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (const file of files) {
            try {
                const uploadedFile = await this.cloudinaryService.uploadFile(file.path, cloudinaryUploadOptions);
                cloudinaryUploadedUrls.push(uploadedFile.secure_url)
                imageDocs.push(await super.createDocument({imageUrl: <string>uploadedFile.secure_url}))
            } finally {
                fs.unlinkSync(`uploads/${file.filename}`)
            }
        }

        return imageDocs
    }

    override async removeDocumentById(id: string) {
        const imageDoc = await super.getDocumentById(id)
        await this.cloudinaryService.destroyFile(extractFileName(imageDoc.imageUrl))

        return await super.removeDocumentById(id)
    }

    async removeMany(ids: string[]) {
        ids.forEach(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError(AppErrorTypeEnum.DB_INVALID_OBJECT_ID)
            }
        })

        const images = await this.imagesModel.find({ _id: { $in: ids } }).exec()
        if (!images) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        const cloudinaryIds = images.map(image => extractFileName(image.imageUrl))

        for (let i = 0; i < images.length; ++i) {
            await this.cloudinaryService.destroyFile(cloudinaryIds[i])
            await this.removeDocumentById(ids[i])
            //await Promise.all([ ])
        }
    }

    async isImageUploaded(url: string): Promise<ImagesDocument|null> {
        const docs = await super.getAllDocuments()
        if (!docs) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        for (const doc of docs) {
            if (doc.imageUrl == url) {
                return doc
            }
        }
        return null
    }

    /***
     * @deprecated Use ImageUploadService::uploadImages instead
     */
    override async createDocument(data: Omit<ImagesDocument, keyof Document>) {
        throw new Error("Use ImageUploadService::uploadImages instead")
        return super.createDocument(data)
    }
}
