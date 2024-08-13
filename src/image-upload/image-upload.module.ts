import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './../common/cloudinary/cloudinary.module';
import { ImageUploadController } from './image-upload.controller';
import { ImagesSchema } from './image-upload.schema'
import { ImageUploadService } from './image-upload.service';

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
export class ImageUploadModule {}
