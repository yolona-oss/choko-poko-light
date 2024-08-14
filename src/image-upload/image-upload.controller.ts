import {
    UseInterceptors,
    UploadedFiles,
    Param,
    Res,
    Get,
    Post,
    Delete,
    Controller,
    Query
} from '@nestjs/common';
import { Response } from 'express'
import { ImageUploadService } from './image-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { AppError } from './../internal/error/AppError';
import { AppErrorTypeEnum } from './../internal/error/AppErrorTypeEnum';
import { ParseObjectIdPipe } from './../common/pipes/ParseObjectIdPipe.pipe';
import { generateRandom } from './../internal/utils';

@Controller('image-upload')
export class ImageUploadController {

    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor("images", 20, { // TODO create constants
        storage: diskStorage({
            destination: (_, __, cb) => cb(null, './uploads'),
                filename: (_, file, cb) => cb(null, `${generateRandom()}_${file.originalname}`)
        })
    }))
    async uploadFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Res() res: Response
    ) {
        if (!files) {
            throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, {
                errorMessage: "No files attached",
                userMessage: "No files attached"
            })
        }

        const jsonRes = await this.imageUploadService.uploadImages(files);
        res.status(200).json(jsonRes)
    }

    @Get('/')
    async getAll(@Res() response: Response) {
        const entries = await this.imageUploadService.getAllDocuments()
        response.status(200).json(entries)
    }

    @Get('/id/:id')
    async getById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const entry = await this.imageUploadService.getDocumentById(id)
        if (entry) {
            response.status(200).send(entry)
        }
        throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
    }

    @Get('/collectionName/:collectionName')
    async getByCollectionName(@Param('collectionName') collection: string, @Res() response: Response) {
        const entry = await this.imageUploadService.findOne({collectionName: collection})
        if (entry) {
            response.status(200).send(entry)
        }
        throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
    }

    @Delete('/id/:id')
    async removeById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.imageUploadService.removeDocumentById(id)
        if (execRes) {
            return response.status(200).json({success: true})
        }
        throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
    }

    @Delete('/remove-concreet')
    async removeConcreet(@Query('fileurl') url: string, @Res() response: Response) {
        await this.imageUploadService.removeConcreetImageFromDefaultCollection(url)
        return response.json({success: true})
    }
}
