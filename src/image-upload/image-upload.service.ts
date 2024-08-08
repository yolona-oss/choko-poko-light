import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ImagesEntity, ImagesDocument, ImagesSchema } from './image-upload.schema';
import { CRUDService } from 'internal/crud-service';
import { CloudinaryService } from 'common/cloudinary/cloudinary.service';
import * as fs from 'fs'
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { AppError } from 'internal/error/AppError';
import { DEFAULT_IMAGES_ENTITY_COLLECTION_NAME } from 'common/constants';
import { extractFileName } from 'internal/utils';

@Injectable()
export class ImageUploadService extends CRUDService<ImagesDocument> {
    constructor(
        @InjectModel('Images')
        private imageUploadModel: Model<ImagesDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super(imageUploadModel)
    }

    async uploadImages(files: Array<Express.Multer.File>, collectionName: string = DEFAULT_IMAGES_ENTITY_COLLECTION_NAME) {
        let imagesURL = new Array<string>;

        const cloudinaryUploadOptions = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        // TODO check if exsisting

        for (const file of files) {
            const uploadedFile = await this.cloudinaryService.uploadFile(file.path, cloudinaryUploadOptions);
            imagesURL.push(uploadedFile.secure_url)
            fs.unlinkSync(`uploads/${file.filename}`)
        }

        // todo may be check for imagesURL

        const existingImagesCollection = await super.findOne({collectionName: collectionName})
        let images: ImagesDocument | null
        if (existingImagesCollection) {
            existingImagesCollection.images.concat(imagesURL)
            images = await existingImagesCollection.save()
        } else {
            images = await super.createEntity({ images: imagesURL, collectionName: collectionName })
        }

        if (!images) {
            for (const image of imagesURL) {
                await this.cloudinaryService.destroyFile(image)
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }

        return images
    }

    override async removeEntityById(id: string) {
        const imagesEntity = await this.getEntityById(id)
        if (!imagesEntity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        for (const image of imagesEntity.images) {
            await this.cloudinaryService.destroyFile(image)
        }
        return await super.removeEntityById(id)
    }

    private async removeConcreetImage(entity: ImagesDocument | null, filename: string) {
        if (!entity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        entity.images = entity.images.filter((value) => value != filename)
        const updated = await entity.save()
        if (!updated) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }
        await this.cloudinaryService.destroyFile(extractFileName(filename))
        return updated
    }

    async removeConcreetImageFromEntityById(id: string, filename: string) {
        const entity = await super.getEntityById(id)
        return await this.removeConcreetImage(entity, filename)
    }

    async removeConcreetImageFromEntryByCollectionName(collectionName: string, filename: string) {
        const entity = await super.findOne({collectionName: collectionName})
        return await this.removeConcreetImage(entity, filename)
    }

    /***
     * @deprecated Use ImageUploadService::uploadImages instead
     */
    override async createEntity(data: Omit<ImagesDocument, keyof Document>) {
        throw new Error("Use ImageUploadService::uploadImages instead")
        return super.createEntity(data)
    }
}
