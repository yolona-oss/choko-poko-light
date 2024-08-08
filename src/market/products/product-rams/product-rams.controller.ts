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
import { ProductRAMsEntity } from './product-rams.schema';

@Controller()
export class ProductRamsController {
    constructor(
        private productRAMsService: ProductRAMsService
    ) {}

    @Get('/')
    async getProductRAMs(@Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.getAllDocuments()
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
            const execRes = await this.productRAMsService.getDocumentById(id)
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
    async createProductRAMs(@Body() data: ProductRAMsEntity, @Res() response: Response) {
        try {
            const execRes = await this.productRAMsService.createDocument(data)
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
            const execRes = await this.productRAMsService.removeDocumentById(id)
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
        @Body() data: Partial<ProductRAMsEntity>,
        @Res() response: Response
    ) {
        try {
            const execRes = await this.productRAMsService.updateDocumentById(id, data)
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
