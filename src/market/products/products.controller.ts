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
import { ParseObjectIdPipe } from 'common/pipes/ParseObjectIdPipe.pipe';
import { Response } from 'express'
import { Product } from './products.schema';
import { defaultsProductFilterParams, ProductFilterParams, ProductsService } from './products.service';
import { RecentlyViewd } from './recently-viewd/recently-viewd.schema';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get('/')
    async getFiltredProducts(@Query() query: ProductFilterParams, @Res() response: Response) {
        const defaultedQuery = {
            ...defaultsProductFilterParams,
            ...query
        }
        const execRes = await this.productsService.getFiltredProducts(defaultedQuery)
        //console.log(defaultedQuery)
        response.status(200).send(execRes)
    }

    @Get('/get/all')
    async getAllProducts(@Res() response: Response) {
        const execRes = await this.productsService.getAllEntities()
        response.json(execRes)
    }

    @Get('/get/count')
    async getProductsCount(@Res() response: Response) {
        const execRes = await this.productsService.getEntitiesCount()
        response.status(200).json({
            productsCount: execRes
        })
    }

    @Get('/featured')
    async getFeaturedProducts(@Query() query: ProductFilterParams, @Res() response: Response) {
        const defaultedQuery = {
            ...defaultsProductFilterParams,
            ...query,
            isFeatured: true
        }
        const execRes = await this.productsService.getFiltredRecentlyViewdProducts(defaultedQuery)
        response.status(200).send(execRes)
    }

    @Post('/recentlyViewd')
    async createNewRecentlyViewd(@Body() body: RecentlyViewd, @Res() response: Response) {
        const execRes = await this.productsService.recentlyViewdService.createEntity({
            prodId:        body.id,
            name:          body.name,
            description:   body.description,
            images:        body.images,
            brand:         body.brand,
            price:         body.price,
            oldPrice:      body.oldPrice,
            subCatId:      body.subCatId,
            catName:       body.catName,
            subCat:        body.subCat,
            category:      body.category,
            countInStock:  body.countInStock,
            rating:        body.rating,
            isFeatured:    body.isFeatured,
            discount:      body.discount,
            productRam:    body.productRam,
            size:          body.size,
            productWeight: body.productWeight,
            dateCreated:   new Date()
        })
        response.status(200).json(execRes)
    }

    @Get('/recentlyViewd')
    async getRecentlyViewd(@Res() response: Response) {
        const execRes = await this.productsService.recentlyViewdService.getAllEntities()
        response.status(200).json(execRes)
    }

    @Post('/create')
    async createNewProduct(@Body() data: Product, @Res() response: Response) {
        const execRes = await this.productsService.createNewEntry(data)
        response.status(200).json(execRes)
    }

    @Get(':id')
    async getProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.productsService.getEntityById(id)
        response.status(200).send(execRes)
    }

    @Delete(':id')
    async removeProductById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.productsService.removeEntityById(id)
        response.status(200).json({
            success: true,
            message: "Product deleted"
        })
    }

    @Put(':id')
    async updateProductById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() newData: Partial<Product>,
        @Res() response: Response
    ) {
        const execRes = await this.productsService.updateEntityById(id, newData)
        response.status(200).json(execRes)
    }
}
