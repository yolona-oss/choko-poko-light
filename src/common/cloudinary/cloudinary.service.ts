import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { AppError } from 'src/internal/error/AppError';
import { AppErrorTypeEnum } from 'src/internal/error/AppErrorTypeEnum';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
    async uploadFile(file_path: string, options: UploadApiOptions): Promise<CloudinaryResponse> {
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

        return await promise.then((result) => {
            return <CloudinaryResponse>result
        }).catch((error) => {
            throw new AppError(AppErrorTypeEnum.CLOUDINARY_ERROR, {
                errorMessage: "Cloudinary upload error: " + error.message
            })
        })
    }

    async destroyFile(public_id: string): Promise<unknown> {
        const promise = new Promise((res, rej) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) {
                    rej(error)
                }
                res(result)
            })
        })

        return await promise.then((result) => {
            return result
        }).catch((error) => {
            throw new AppError(AppErrorTypeEnum.CLOUDINARY_ERROR, {
                errorMessage: "Cloudinary destroy error: " + error.message
            })
        })
    }
}
