import mongoose from 'mongoose';
import { Param, Res, Get, Post, Delete, Put, Body, Controller } from '@nestjs/common';
import { Response } from 'express'
import { HomeBannerService } from './home-banner.service';
import { ParseObjectIdPipe } from './../common/pipes/parse-object-id.pipe';
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';

@Controller('home-banner')
export class HomeBannerController {
    constructor(private homeBannerService: HomeBannerService) {}

    @Get('/')
    async all(@Res() response: Response) {
        const entries = await this.homeBannerService.findAll()
        return response.status(200).json(entries)
    }

    @Get('/id/:id')
    async get(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const doc = await this.homeBannerService.findById(id)
        return response.status(200).send(doc)
    }

    @Post('/create')
    async create(
        @Body() body: CreateHomeBannerDto,
        @Res() response: Response
    ) {
        await this.homeBannerService.createBanner({
            images: body.images
        })
        response.status(200).json({})
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        await this.homeBannerService.removeById(id)
        return response.status(200).json({success: true, message: "Slide deleted"})
    }

    @Put(':id')
    async update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() body: UpdateHomeBannerDto,
        @Res() response: Response
    ) {
        const updatedDoc = await this.homeBannerService.updateById(id, {
            images: body.images
        })
        return response.status(200).json(updatedDoc)
    }
}
