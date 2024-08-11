import {
    Res,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    BadRequestException,
    Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductSizeService } from './product-size.service';
import { ProductSizeEntity } from './product-size.schema';

@Controller()
export class ProductSizeController {
    constructor(private productSizeService: ProductSizeService) {}

    @Get('/')
    async getProductSizes(@Res() response: Response) {
        try {
            const execRes = await this.productSizeService.getAllDocuments()
            if (execRes) {
                response.status(200).json(execRes)
            } else {
                response.status(500).json({
                    success: false
                })
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Get('/id/:id')
    async getProductSizeById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productSizeService.getDocumentById(id)
        response.status(200).send(execRes)
    }

    @Post('/create')
    async createProductSize(@Body() data: ProductSizeEntity, @Res() response: Response) {
        const execRes = await this.productSizeService.createDocument(data)
        response.status(200).json(execRes)
    }

    @Delete('/:id')
    async removeProductSizeById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productSizeService.removeDocumentById(id)
        response.status(200).json({
            message: 'Item deleted',
            success: true
        })
    }

    @Put('/:id')
    async updateProductSizeById(
        @Param('id') id: string,
        @Body() data: Partial<ProductSizeEntity>,
        @Res() response: Response
    ) {
        const execRes = await this.productSizeService.updateDocumentById(id, data)
        response.status(200).send(execRes)
    }
}
