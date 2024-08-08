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
    NotFoundException
} from '@nestjs/common';
import { Response } from 'express';
import { ProductWeightService } from './product-weight.service';
import { ProductWeight } from './product-weight.schema';

@Controller()
export class ProductWeightController {
    constructor(private productWeightSerivce: ProductWeightService) {}

    @Get('/')
    async getAllProductWeights(@Res() response: Response) {
        const execRes = await this.productWeightSerivce.getAllEntities()
        response.status(200).json(execRes)
    }

    @Get('/:id')
    async getProductWeightById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.getEntityById(id)
        response.status(200).json(execRes)
    }

    @Post('/create')
    async createProductWeight(@Body() data: ProductWeight, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.createEntity(data)
        response.status(200).json(execRes)
    }

    @Delete('/:id')
    async deleteProductWeightById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productWeightSerivce.removeEntityById(id)
        response.status(200).json({
            message: 'Item deleted',
            success: false
        })
    }

    @Put('/:id')
    async updateProductWeight(
        @Param('id') id: string,
        @Body() data: Partial<ProductWeight>,
        @Res() response: Response
    ) {
        const execRes = await this.productWeightSerivce.updateEntityById(id, data)
        response.status(200).send(execRes)
    }
}
