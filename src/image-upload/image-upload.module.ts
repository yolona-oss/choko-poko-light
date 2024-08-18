import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import path from 'path'

import { ImageUploadService } from './image-upload.service';

import { CloudinaryModule } from './../common/cloudinary/cloudinary.module';

import { ImageUploadController } from './image-upload.controller';
import { ImagesSchema } from './schemas/image-upload.schema'

import { DefaultImagesType } from './../common/enums/default-images.enum'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Images', schema: ImagesSchema }
        ]),
        CloudinaryModule
    ],
    providers: [ImageUploadService],
    controllers: [ImageUploadController],
    exports: [ImageUploadService]
})
export class ImageUploadModule implements OnApplicationBootstrap {
    constructor(
        private imagesService: ImageUploadService,
        private configService: ConfigService
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        // TODO create loop method
        const userImage = {
            path: path.join(__dirname, '..', '..', '..', String(this.configService.getOrThrow<string>('blank_images.user'))),
            type: "User" as DefaultImagesType
        }
        const productImage = {
            path: path.join(__dirname, '..', '..', '..', String(this.configService.getOrThrow<string>('blank_images.product'))),
            type: "Product" as DefaultImagesType
        }
        await this.imagesService.__createDefaultBlankImages([userImage, productImage])
    }
}
