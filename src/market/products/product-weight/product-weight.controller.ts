import {
    Res,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductWeightService } from './product-weight.service';
import { ProductWeightEntity } from './product-weight.schema';

@Controller()
export class ProductWeightController {
    constructor(private productWeightSerivce: ProductWeightService) {}

    @Get('/')
    async getAllProductWeights(@Res() response: Response) {
        const execRes = await this.productWeightSerivce.getAllDocuments()
        response.status(200).json(execRes)
    }

    @Get('/id/:id')
    async getProductWeightById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.getDocumentById(id)
        response.status(200).json(execRes)
    }

    @Post('/create')
    async createProductWeight(@Body() data: ProductWeightEntity, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.createDocument(data)
        response.status(200).json(execRes)
    }

    @Delete('/:id')
    async deleteProductWeightById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.removeDocumentById(id)
        response.status(200).json({
            message: 'Item deleted',
            success: false
        })
    }

    @Put('/:id')
    async updateProductWeight(
        @Param('id') id: string,
        @Body() data: Partial<ProductWeightEntity>,
        @Res() response: Response
    ) {
        const execRes = await this.productWeightSerivce.updateDocumentById(id, data)
        response.status(200).send(execRes)
    }
}
