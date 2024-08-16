import {
    Put,
    Delete,
    Param,
    Query,
    Body,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Response } from 'express'

import { ParseObjectIdPipe } from './../../common/pipes/ParseObjectIdPipe.pipe';
import { CategoryService } from './category.service';

import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

import { Public } from './../../common/decorators/public.decorotor';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ) {}

    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const result = await this.categoryService.findFiltredWrapper(query)
        response.status(200).json(result)
    }

    @Get('/id/:id')
    async getCategoryById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const category = await this.categoryService.getDocumentById(id)
        response.json(category)
    }

    @Get('/count')
    async getCategoryEntriesCount(@Res() response: Response) {
        const catCount = await this.categoryService.getDocumentsCount()
        response.json({
            categoryCount: catCount
        })
    }

    @Post('/create')
    async createCategory(
        @Body() body: {
            name: string,
            subCat: string,
            images: string[],
            color: string
        },
        @Res() response: Response
    ) {
        const category = await this.categoryService.createDocument({
            name: body.name,
            // @ts-ignore
            //subCat: body.subCat,
            images: body.images,
            color: body.color
        });

        if (!category) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }

        response.json(category);
    }

    @Delete('/:id')
    async removeById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        await this.categoryService.removeDocumentById(id);

        response.status(200).json({
            success: true,
        })
    }

    @Put('/:id')
    async updateById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() body: {name?: string, images?: string[], color?: string},
        @Res() response: Response
    ) {
        const updatedCat = await this.categoryService.updateDocumentById(
            id,
            {
                name: body.name,
                images: body.images?.map(id => new mongoose.Schema.Types.ObjectId(id)),
                color: body.color
            }
        )

        response.json(updatedCat);
    }
}

