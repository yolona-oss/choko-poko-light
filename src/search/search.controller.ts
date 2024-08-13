import { Query, Res, Get, Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { Response } from 'express'
import { ProductsService } from './../market/products/products.service';

@Controller('search')
export class SearchController {

    constructor(private productService: ProductsService) {}

    @Get()
    async search(@Query('q') q: any, @Res() response: Response) {
        // TODO create projection
        if (!q) {
            throw new BadRequestException("Query is required")
        }
        const foundItems = await this.productService.searchFunc(q)

        if (foundItems) {
            response.status(200).json(foundItems)
        } else {
            throw new BadRequestException()
        }
    }
}
