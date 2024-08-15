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
import { ParseObjectIdPipe } from './../../common/pipes/ParseObjectIdPipe.pipe';
import { Response } from 'express'
import { ProductEntity } from './products.schema';
import { ProductsService } from './products.service';
import { RecentlyViewedEntity } from './recently-viewd/recently-viewd.schema';
import { ProductFilterParams } from './interfaces/ProductFilterParams';
import { CreateProductDto } from './dto/create-product.dto';

import { Public } from './../../common/decorators/public.decorotor';
import { Roles } from './../../common/decorators/role.decorator';
import { Role } from './../../common/enums/role.enum';

@Controller()
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Public()
    @Get('/filtred')
    async getFiltredProducts(@Query() query: any, @Res() response: Response) {
        console.log("Queyr: " + JSON.stringify(query, null, '\n'))
        const execRes = await this.productsService.getFiltredProducts(query)
        response.status(200).send(execRes)
    }

    @Public()
    @Get('/')
    async getAllProducts(@Res() response: Response) {
        const execRes = await this.productsService.getAllDocuments()
        response.json(execRes)
    }

    @Public()
    @Get('/count')
    async getProductsCount(@Res() response: Response) {
        const execRes = await this.productsService.getDocumentsCount()
        response.status(200).json({
            productsCount: execRes
        })
    }

    @Public()
    @Get('/get/featured')
    async getFeaturedProducts(@Query() query: ProductFilterParams, @Res() response: Response) {
        Object.assign(query, {isFutured: true})
        const execRes = await this.productsService.getFiltredRecentlyViewdProducts(query)
        response.status(200).send(execRes)
    }

    @Roles(Role.Admin)
    @Post('/recentlyViewd')
    async createNewRecentlyViewd(@Body() body: RecentlyViewedEntity, @Res() response: Response) {
        const execRes = await this.productsService.recentlyViewdService.createDocument(body)
        response.status(200).json(execRes)
    }

    @Public()
    @Get('/recentlyViewd/')
    async getRecentlyViewd(@Res() response: Response) {
        const execRes = await this.productsService.recentlyViewdService.getAllDocuments()
        response.status(200).json(execRes)
    }

    @Roles(Role.Admin)
    @Post('/create')
    async createNewProduct(@Body() data: CreateProductDto, @Res() response: Response) {
        const execRes = await this.productsService.createNewProduct(data)
        response.status(200).json(execRes)
    }

    @Public()
    @Get('/id/:id')
    async getProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.productsService.getDocumentById(id)
        response.status(200).send(execRes)
    }

    @Roles(Role.Admin)
    @Delete('/:id')
    async removeProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.productsService.removeDocumentById(id)
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
        const execRes = await this.productsService.updateDocumentById(id, newData)
        response.status(200).json(execRes)
    }
}
