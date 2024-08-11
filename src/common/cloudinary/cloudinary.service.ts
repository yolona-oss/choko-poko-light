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

    async destroyFile(public_id: string) {
        console.log("Cloudinary deleting file: " + public_id)
        const res = await cloudinary.uploader.destroy(public_id)
        console.log(res)
        return res
    }
}
