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

@Controller('product/weight')
export class ProductWeightController {
    constructor(private productWeightSerivce: ProductWeightService) {}

    @Get('/')
    async getAllProductWeights(@Res() response: Response) {
        try {
            const execRes = await this.productWeightSerivce.getAllEntities()
            if (execRes) {
                response.status(200).json(execRes)
            } else {
                throw new NotFoundException("Cannot retrive wight")
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Get('/:id')
    async getProductWeightById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productWeightSerivce.getEntityById(id)
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

    @Post('/create')
    async createProductWeight(@Body() data: ProductWeight, @Res() response: Response) {
        try {
            const execRes = await this.productWeightSerivce.createEntity(data)
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

    @Delete('/:id')
    async deleteProductWeightById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productWeightSerivce.removeEntityById(id)
            if (execRes) {
                response.status(200).json({
                    message: 'Item deleted',
                    success: false
                })
            } else {
                response.status(500).json({
                    success: false
                })
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Put('/:id')
    async updateProductWeight(
        @Param('id') id: string,
        @Body() data: Partial<ProductWeight>,
        @Res() response: Response
    ) {
        try {
            const execRes = await this.productWeightSerivce.updateEntityById(id, data)
            if (execRes) {
                response.status(200).send(execRes)
            } else {
                response.status(500).json({
                    success: false
                })
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}
