import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { AppError, AppErrorTypeEnum } from './../app-error';
import { CloudinaryResponse } from './types/cloudinary-response.type';

@Injectable()
export class CloudinaryService {
    async uploadFile(file_path: string, options: UploadApiOptions): Promise<CloudinaryResponse|any> {
        try {
            const promise = new Promise((res, rej) => {
                cloudinary.uploader.upload(
                    file_path,
                    options,
                    (error, result) => {
                        if (error) {
                            rej(error)
                        }
                        res(<CloudinaryResponse>result)
                    }
                );
            })

            return <CloudinaryResponse>await promise
        } catch(error: any) {
            throw new AppError(AppErrorTypeEnum.CLOUDINARY_ERROR, {
                errorMessage: "Cloudinary upload error: " + error.message,
                userMessage: "Cloudinary upload error"
            })
        }
    }

    async destroyFile(public_id: string): Promise<unknown> {
        try {
            const promise = new Promise((res, rej) => {
                cloudinary.uploader.destroy(public_id, (error, result) => {
                    if (error) {
                        rej(error)
                    }
                    res(result)
                })
            })
            return await promise
        } catch(error: any) {
            throw new AppError(AppErrorTypeEnum.CLOUDINARY_ERROR, {
                errorMessage: "Cloudinary destroy error: " + error.message
            })
        }
    }
}
