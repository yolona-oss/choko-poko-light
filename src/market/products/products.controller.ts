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
import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';
import { Response } from 'express'

import { ProductReviewsService } from './product-reviews/product-reviews.service';
import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './schemas/products.schema';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';

import { Role } from './../../common/enums/role.enum';
import { CreateProductReviewDto } from './product-reviews/dto/create-review.dto';

@Controller()
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly reviewsService: ProductReviewsService
    ) {}

    @Public()
    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const execRes = await this.productsService.findFiltred(query)
        return response.status(200).json(execRes)
    }

    @Public()
    @Get('/count')
    async productsCount(@Res() response: Response) {
        const count = await this.productsService.productsCount()
        response.status(200).json({
            productsCount: count
        })
    }

    @Roles(Role.Admin)
    @Post('/create')
    async create(@Body() data: CreateProductDto, @Res() response: Response) {
        const execRes = await this.productsService.create(data)
        response.status(200).json(execRes)
    }

    @Public()
    @Get('/:id')
    async productById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const doc = await this.productsService.findById(id)
        response.status(200).send(doc)
    }

    @Public()
    @Get('/reviews/:id')
    async productReviews(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const doc = await this.reviewsService.findByProductId(id)
        response.status(200).json(doc)
    }

    @Roles(Role.User)
    @Post('/reviews/:id/add')
    async createProductReviews(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: CreateProductReviewDto,
        @Res() response: Response
    ) {
        if (id != data.prodcut) {
            return response.status(400)
        }
        const execRes = await this.reviewsService.createReview(data)
        return response.status(200).json(execRes)
    }

    @Roles(Role.Admin)
    @Delete('/:id/delete')
    async removeProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const deleted = await this.productsService.remove(id)
        response.status(200).json(deleted)
    }

    @Roles(Role.Admin)
    @Put('/:id/update')
    async updateProductById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() newData: Partial<ProductEntity>,
        @Res() response: Response
    ) {
        const execRes = await this.productsService.update(id, newData)
        response.status(200).json(execRes)
    }
}
