import { Query, Param, Res, Get, Post, Delete, Put, Body, Controller } from '@nestjs/common';
import { Response } from 'express'
import { HomeBannerService } from './home-banner.service';

@Controller('home-banner')
export class HomeBannerController {
    constructor(private homeBannerService: HomeBannerService) {}

    @Get()
    async getAll(@Res() response: Response) {
        const entries = await this.homeBannerService.getAllDocuments()
        return response.status(200).json(entries)
    }

    @Get('/id/:id')
    async getEntryById(@Param('id') id: string, @Res() response: Response) {
        const doc = await this.homeBannerService.getDocumentById(id)
        return response.status(200).send(doc)
    }

    @Post('/create')
    async createNewEntry(@Body() body: {images: string[]}, @Res() response: Response) {
        await this.homeBannerService.createDocument({images: body.images})
        return response.status(200).json({success: true, message: "Images added"})
    }

    @Delete(':id')
    async removeById(@Param('id') id: string, @Res() response: Response) {
        await this.homeBannerService.removeDocumentById(id)
        return response.json({success: true, message: "Slide deleted"})
    }

    @Put(':id')
    async updateEntry(
        @Param('id') id: string,
        @Body() body: {images: string[]},
        @Res() response: Response
    ) {
        const updatedDoc = await this.homeBannerService.updateDocumentById(id, {images: body.images})
        return response.send(updatedDoc)
    }
}
