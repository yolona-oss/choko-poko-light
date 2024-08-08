import { Query, Param, Res, Get, Post, Delete, Put, Body, Controller, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express'
import { HomeBannerService } from './home-banner.service';
import { extractFileName } from 'internal/utils';

@Controller('homeBanner')
export class HomeBannerController {
    constructor(private homeBannerService: HomeBannerService) {}

    @Get()
    async getAllEntries(@Res() response: Response) {
        const entries = await this.homeBannerService.getAll()
        if (entries) {
            return response.status(200).json(entries)
        }
        throw new BadRequestException("Cannot retrive banners")
    }

    @Get(':id')
    async getEntryById(@Param('id') id: string, @Res() response: Response) {
        const entry = await this.homeBannerService.getById(id)
        if (entry) {
            return response.status(200).send(entry)
        }
        throw new BadRequestException('Slide with given ID was not found')
    }

    @Post('/create')
    async createNewEntry(@Body() body: {images: string[]}, @Res() response: Response) {
        const execRes = await this.homeBannerService.create(body.images)
        if (execRes) {
            return response.status(200).json({success: true, message: "Images added"})
        }
        throw new BadRequestException("Cannot add new entries")
    }

    @Delete('deleteImage')
    async removeEntry(@Query('img') imgUrl: string, @Res() response: Response) {
        const execRes = await this.homeBannerService.removeFromCloudinary(extractFileName(imgUrl))
        if (execRes) {
            return response.status(200).send(execRes)
        }
        throw new Error()
    }

    @Delete(':id')
    async removeEntryById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.homeBannerService.removeById(id)
        if (execRes) {
            return response.status(200).json({success: true, message: "Slide deleted"})
        }
        throw new NotFoundException("Slide not found")
    }

    @Put(':id')
    async updateEntry(
        @Param('id') id: string,
        @Body() body: {images: string[]},
        @Res() response: Response
    ) {
        const execRes = await this.homeBannerService.updateById(id, body.images)
        if (execRes) {
            return response.send(execRes)
        }
        throw new BadRequestException("Item cannot be updated")
    }
}
