import { Document, Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ImagesDocument } from './image-upload.schema';
import { CRUDService } from './../internal/crud-service';
import { CloudinaryService } from './../common/cloudinary/cloudinary.service';
import * as fs from 'fs'
import { AppErrorTypeEnum } from './../internal/error/AppErrorTypeEnum';
import { AppError } from './../internal/error/AppError';
import { DEFAULT_IMAGES_ENTITY_COLLECTION_NAME } from './../common/constants';
import { extractFileName } from './../internal/utils';

interface A {
    asdf: number
    foo: string
}

interface B {
    bar: number
}

@Injectable()
export class ImageUploadService extends CRUDService<ImagesDocument> {
    constructor(
        @InjectModel('Images')
        private imageUploadModel: Model<ImagesDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super(imageUploadModel)
    }

    async uploadImages(
        files: Array<Express.Multer.File>,
        collectionName: string = DEFAULT_IMAGES_ENTITY_COLLECTION_NAME
    ) {
        let imagesURL = new Array<string>;

        const cloudinaryUploadOptions = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        // TODO check if exsisting with redis? and return existing

        for (const file of files) {
            const uploadedFile = await this.cloudinaryService.uploadFile(file.path, cloudinaryUploadOptions);
            imagesURL.push(uploadedFile.secure_url)
            fs.unlinkSync(`uploads/${file.filename}`)
        }

        // todo may be check for imagesURL

        try {
            const existingImagesCollection = await super.findOne({collectionName: collectionName})
            let images: ImagesDocument | null

            if (existingImagesCollection) {
                const _images = existingImagesCollection.images.concat(imagesURL)
                images = await this.imageUploadModel.findByIdAndUpdate(existingImagesCollection.id, {images: _images})
            } else {
                images = await super.createDocument({ images: imagesURL, collectionName: collectionName })
            }

            return {
                imagesDocument: images,
                uploadedImages: imagesURL
            }
        } catch (error: any) {
            for (const image of imagesURL) {
                await this.cloudinaryService.destroyFile(extractFileName(image))
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }
    }

    async getDocumentFromDefaultCollection(): Promise<ImagesDocument> {
        return await this.getDocumentByCollectionName(DEFAULT_IMAGES_ENTITY_COLLECTION_NAME)
    }

    async getDocumentByCollectionName(collectionName: string) {
        try {
            const doc = await this.imageUploadModel.findOne({collectionName: collectionName})
            if (!doc) {
                throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
            }
            return doc
        } catch (e) {
            if (e instanceof AppError) {
                throw e
            }
            throw new BadRequestException(e)
        }
    }

    override async removeDocumentById(id: string) {
        const imagesEntity = await this.getDocumentById(id)
        if (!imagesEntity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        for (const image of imagesEntity.images) {
            await this.cloudinaryService.destroyFile(extractFileName(image))
        }
        return await super.removeDocumentById(id)
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
        const entity = await super.getDocumentById(id)
        return await this.removeConcreetImage(entity, filename)
    }

    async removeConcreetImageFromEntryByCollectionName(collectionName: string, filename: string) {
        const entity = await this.getDocumentByCollectionName(collectionName)
        return await this.removeConcreetImage(entity, filename)
    }

    async removeConcreetImageFromDefaultCollection(filename: string) {
        return await this.removeConcreetImageFromEntryByCollectionName(DEFAULT_IMAGES_ENTITY_COLLECTION_NAME, filename)
    }

    /***
     *
     * @param filename - file name like "foobaar.jpg"
     *
     * @returns method returns string: url of uploaded image or false if file not uploaded
     */
    async isImageUploaded(filename: string) {
        const docs = await super.getAllDocuments()
        if (!docs) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        for (const doc of docs) {
            for (const image of doc.images) {
                if (extractFileName(image, false) == extractFileName(filename, false)) {
                    return image
                }
            }
        }
        return false
    }

    /***
     * @deprecated Use ImageUploadService::uploadImages instead
     */
    override async createDocument(data: Omit<ImagesDocument, keyof Document>) {
        throw new Error("Use ImageUploadService::uploadImages instead")
        return super.createDocument(data)
    }

    /***
     * @description interact only with default collection
     *
     * @description used because legacy db is not using relations with iamges model
     *
     * @returns returns count of deleted images
     */
    async removeImagesFromModelById<T extends { images: string[] }>(
        model: Model<T>,
        id: string
    ) {
        const targetDoc = await model.findById(id)
        if (!targetDoc) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        let count = 0
        for (const image of targetDoc.images) {
            count++
                await this.removeConcreetImageFromDefaultCollection(image)
        }
        return count
    }
}
