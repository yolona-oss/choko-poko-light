import {
    Res,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
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
        const execRes = await this.productRAMsService.getAllDocuments()
        response.status(200).json(execRes)
    }

    @Get('/id/:id')
    async getProductRAMsById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productRAMsService.getDocumentById(id)
        response.status(200).send(execRes)
    }

    @Post('/create')
    async createProductRAMs(@Body() data: ProductRAMsEntity, @Res() response: Response) {
        const execRes = await this.productRAMsService.createDocument(data)
        response.status(200).json(execRes)
    }

    @Delete('/:id')
    async removeProductRAMsById(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.productRAMsService.removeDocumentById(id)
        response.status(200).json(execRes)
    }

    @Put('/:id')
    async updateProductRAMsById(
        @Param('id') id: string,
        @Body() data: Partial<ProductRAMsEntity>,
        @Res() response: Response
    ) {
        const execRes = await this.productRAMsService.updateDocumentById(id, data)
        response.status(200).json(execRes)
    }
}
