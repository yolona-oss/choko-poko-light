import {
    Res,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    BadRequestException,
    Controller
} from '@nestjs/common';
import { Response } from 'express';
import { ProductRAMsService } from './product-rams.service';
import { ProductRAMs } from './product-rams.schema';

@Controller()
export class ProductRamsController {
    constructor(
        private productRAMsService: ProductRAMsService
    ) {}

    @Get('/')
    async getProductRAMs(@Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.getAllEntities()
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
    async getProductRAMsById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.getEntityById(id)
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

    @Post('/create')
    async createProductRAMs(@Body() data: ProductRAMs, @Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.createEntity(data)
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
    async removeProductRAMsById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.removeEntityById(id)
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

    @Put('/:id')
    async updateProductRAMsById(
        @Param('id') id: string,
        @Body() data: Partial<ProductRAMs>,
        @Res() response: Response
    ) {
        try {
            const execRes = await this.productRAMsService.updateEntityById(id, data)
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
}
