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
import { ProductSizeService } from './product-size.service';
import { ProductSize } from './product-size.schema';

@Controller()
export class ProductSizeController {
    constructor(private productSizeService: ProductSizeService) {}

    @Get('/')
    async getProductSizes(@Res() response: Response) {
        try {
            const execRes = await this.productSizeService.getAllEntities()
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
        try {
            const execRes = await this.productSizeService.getEntityById(id)
            if (execRes) {
                response.status(200).send(execRes)
            } else {
                throw new NotFoundException("Not found", {cause: new Error(), description: ""})
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Post('/create')
    async createProductSize(@Body() data: ProductSize, @Res() response: Response) {
        try {
            const execRes = await this.productSizeService.createEntity(data)
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
    async removeProductSizeById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productSizeService.removeEntityById(id)
            if (execRes) {
                response.status(200).json({
                    message: 'Item deleted',
                    success: true
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
    async updateProductSizeById(
        @Param('id') id: string,
        @Body() data: Partial<ProductSize>,
        @Res() response: Response
    ) {
        try {
            const execRes = await this.productSizeService.updateEntityById(id, data)
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
