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
import { Response } from 'express'
import { ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

import { CategoryService } from './category.service';
import { ParseObjectIdPipe } from './../../common/pipes/ParseObjectIdPipe.pipe';
import { Public } from './../../common/decorators/public.decorotor';
import { AppError } from './../../internal/error/AppError';
import { AppErrorTypeEnum } from './../../internal/error/AppErrorTypeEnum';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ) {}

    @Get('/filtred')
    async getFiltredCategories(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
        @Res() response: Response
    ) {
        const result = await this.categoryService.getFiltredEntities(page, perPage)
        response.status(200).json(result)
    }

    @Get('/')
    async getAllDocs(@Res() response: Response) {
        const allDocs = await this.categoryService.getAllDocuments()
        response.json({
            categoryList: allDocs
        })
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
        @Body() body: {name: string, images: string[], color: string},
        @Res() response: Response
    ) {
        const updatedCat = await this.categoryService.updateDocumentById(
            id,
            {
                name: body.name,
                images: body.images,
                color: body.color
            }
        )

        response.json(updatedCat);
    }
}

