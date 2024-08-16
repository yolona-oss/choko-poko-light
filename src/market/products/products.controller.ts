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
    NotImplementedException,
} from '@nestjs/common';
import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';
import { Response } from 'express'
import { ProductEntity } from './schemas/products.schema';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';
import { Role } from './../../common/enums/role.enum';

@Controller()
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Public()
    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const execRes = await this.productsService.findFiltredWrapper(query)
        response.json(execRes)
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
    @Get('/id/:id')
    async productById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const doc = await this.productsService.findById(id)
        response.status(200).send(doc)
    }

    @Public()
    @Get('/id/:id/reviews')
    async productReviews(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        throw new NotImplementedException()
        id
        response.json()
    }

    @Roles(Role.User)
    @Post('/id/:id/reviews')
    async createProductReviews(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        throw new NotImplementedException()
        id
        response.json()
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    async removeProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const deleted = await this.productsService.remove(id)
        response.status(200).json({
            success: true,
            message: "Product deleted"
        })
    }

    @Roles(Role.Admin)
    @Put('/:id')
    async updateProductById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() newData: Partial<ProductEntity>,
        @Res() response: Response
    ) {
        const execRes = await this.productsService.update(id, newData)
        response.status(200).json(execRes)
    }
}
