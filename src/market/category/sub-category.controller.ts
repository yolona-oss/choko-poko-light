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

import { SubCategoryService } from './sub-category.service';

import { AppError, AppErrorTypeEnum } from './../../common/app-error';
import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';


@Controller('sub-category')
export class SubCategoryController {
    constructor(
        private subCategoryService: SubCategoryService
    ) {}

    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const result = await this.subCategoryService.findFiltredWrapper(query)
        response.status(200).json(result)
    }

    @Get('/count')
    async count(@Res() response: Response) {
        const subCatCount = await this.subCategoryService.getDocumentsCount()
        response.status(200).json(subCatCount)
    }

    @Post('/create')
    async create(@Body() body: {category: string, subCat: string}, @Res() response: Response) {
        console.log(body)
        if (!mongoose.isValidObjectId(body.category)) {
            throw new AppError(AppErrorTypeEnum.INVALID_OBJECT_ID)
        }

        try {
            const subCat = await this.subCategoryService.createDocument({
                // @ts-ignore
                category: body.category,
                subCat: body.subCat
            });

            if (!subCat) {
                throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
            }

            response.status(200).json(subCat);
        } catch (e) {
            if (e instanceof AppError) {
                throw e
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }
    }

    @Get('/:id')
    async getById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const subCategory = await this.subCategoryService.getDocumentById(id)
        response.status(200).json(subCategory)
    }

    @Delete('/:id')
    async remove(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        await this.subCategoryService.removeDocumentById(id);

        response.status(200).json({
            success: true,
        })
    }

    @Put('/:id')
    async updateById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() body: {category: string, subCat: string},
        @Res() response: Response
    ) {
        if (!mongoose.isValidObjectId(body.category)) {
            throw new AppError(AppErrorTypeEnum.INVALID_OBJECT_ID)
        }

        const subCat = await this.subCategoryService.updateDocumentById(
            id,
            {
                // @ts-ignore
                category: body.category,
                subCat: body.subCat,
            }
        )

        if (!subCat) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE)
        }

        response.status(200).json(subCat);
    }
}
