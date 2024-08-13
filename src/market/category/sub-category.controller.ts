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
    ParseIntPipe,
    DefaultValuePipe
} from '@nestjs/common';
import { Response } from 'express'
import { SubCategoryService } from './sub-category.service';
import { ParseObjectIdPipe } from './../../common/pipes/ParseObjectIdPipe.pipe';
import mongoose from 'mongoose';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

@Controller('sub-category')
export class SubCategoryController {
    constructor(
        private subCategoryService: SubCategoryService
    ) {}

    @Get('/filtred')
    async getFiltredSubCategories(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
        @Res() response: Response
    ) {
        const result = await this.subCategoryService.getFiltredEntities(page, perPage)
        response.status(200).json(result)
    }

    @Get('/')
    async getAllDocs(@Res() response: Response) {
        const allDocs = await this.subCategoryService.getAllDocuments()
        response.json({
            subCategoryList: allDocs
        })
    }

    @Get('/id/:id')
    async getSubCategoryById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const subCategory = await this.subCategoryService.getDocumentById(id)
        response.json(subCategory)
    }

    @Get('/count')
    async getSubCategoryEntriesCount(@Res() response: Response) {
        const subCatCount = await this.subCategoryService.getDocumentsCount()
        response.json({subCatCount: subCatCount})
    }

    @Post('/create')
    async createSubCategory(@Body() body: {category: string, subCat: string}, @Res() response: Response) {
        console.log(body)
        if (!mongoose.isValidObjectId(body.category)) {
            throw new AppError(AppErrorTypeEnum.DB_INVALID_OBJECT_ID)
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

            response.json(subCat);
        } catch (e) {
            if (e instanceof AppError) {
                throw e
            }
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_CREATE)
        }
    }

    @Delete('/:id')
    async removeById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
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
            throw new AppError(AppErrorTypeEnum.DB_INVALID_OBJECT_ID)
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

        response.json(subCat);
    }
}
