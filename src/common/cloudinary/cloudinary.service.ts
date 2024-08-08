import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
    async uploadFile(file_path: string, options: UploadApiOptions): Promise<CloudinaryResponse> {
        console.log("Cloudinary uploading file: " + file_path)
        return await cloudinary.uploader.upload(
            file_path,
            options
        );
    }

    async destroyFile(imageName: string) {
        return await cloudinary.uploader.destroy(
            imageName,
            (e, r) => {
                console.log(e, r)
            }
        )
    }
}
