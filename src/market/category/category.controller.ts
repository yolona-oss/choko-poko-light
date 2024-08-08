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
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { Response } from 'express'
import { Category } from './category.schema';
import { SubCategory } from './sub-category.schema';

import { CategoryService } from './category.service';
import { SubCategoryService } from './sub-category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private subCategoryService: SubCategoryService
    ) {}

    @Get('/')
    async getAllCarts(@Res() response: Response) {
        const execRes = await this.categoryService.getAllEntities()
        if (execRes) {
            response.status(200).json(execRes)
        }
        throw new NotFoundException("Cannot retrive orders")
    }
}

