import {
    UseInterceptors,
    UploadedFiles,
    Query,
    Param,
    Res,
    Get,
    Post,
    Delete,
    Body,
    Controller,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { Response } from 'express'
import { ImageUploadService } from './image-upload.service';
import { extractFileName } from 'internal/utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'

@Controller('image-upload')
export class ImageUploadController {
    constructor(private imageUploadService: ImageUploadService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor("images", 99, {
        storage: diskStorage({
            destination: (_, __, cb) => cb(null, './uploads'),
            filename: (_, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
        })
    }))
    async uploadFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Res() res: Response
    ) {
        if (!files) {
            throw new BadRequestException("Cannot read files")
        }
        // TODO add exception catcher
        const uploadedImages = await this.imageUploadService.uploadImages(files);
        if (uploadedImages) { // its dont run if thow
            res.status(200).json(uploadedImages)
        } else {
            res.status(500).json()
        }
    }


    @Get('/')
    async getAllEntries(@Res() response: Response) {
        const entries = await this.imageUploadService.getAllEntities()

        if (entries) {
            response.status(200).json(entries)
        } else {
            response.status(500).json({success: false})
        }
    }

    @Get(':id')
    async getEntryById(@Param('id') id: string, @Res() response: Response) {
        const entry = await this.imageUploadService.getEntityById(id)
        if (entry) {
            response.status(200).send(entry)
        } else {
            response.status(500).json({message: 'Slide with given ID was not found'})
        }
    }

    @Post('/create')
    async createNewEntry(@Body() body: {images: string[]}, @Res() response: Response) {
        const execRes = await this.imageUploadService.createEntity({images: body.images})
        if (execRes) {
            response.status(200).json({success: true, message: "Images added"})
        } else {
            throw new BadRequestException("Cannot add new entries")
        }
    }

    @Delete('/remove-cloudinary')
    async removeFromCloudinary(@Query('img') imgUrl: string, @Res() response: Response) {
        const execRes = await this.imageUploadService.removeFromCloudinary(extractFileName(imgUrl))
        if (execRes) {
            response.status(200).send(execRes)
        }
    }

    @Delete(':id')
    async removeEntryById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.imageUploadService.removeEntityById(id)
        if (execRes) {
            return response.status(200).json({success: true, message: "Slide deleted"})
        }
        throw new NotFoundException("Slide not found")
    }

    @Delete('/deleteAllImages')
    async removeAll(@Res() response: Response) {
        console.log("REMOVING")
        try {
            let removedEntries
            const entries = await this.imageUploadService.getAllEntities()
            console.log("Entries " + entries)
            for (const entry of entries) {
                console.log("removing img with id " + entry.id)
                //await this.imageUploadService.removeEntryById(entry.id)
            }
            response.json(removedEntries)
        } catch (e: any) {
            throw new BadRequestException("Cannot delete all images", {cause: new Error(e)})
        }
    }
}
