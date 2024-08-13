import {
    Res,
    Get,
    Post,
    Param,
    Body,
    Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsEntity } from './product-reviews.schema';
import { ParseObjectIdPipe } from './../../../common/pipes/ParseObjectIdPipe.pipe';

@Controller()
export class ProductReviewsController {
    constructor(private productReviewsService: ProductReviewsService) {}

    @Get('/')
    async getProductReviews(@Res() response: Response) {
        const execRes = await this.productReviewsService.getAllDocuments()
        response.status(200).json(execRes)
    }

    @Get('/count')
    async getReviewsCount(@Res() response: Response) {
        const execRes = await this.productReviewsService.getDocumentsCount()
        response.status(200).json({
            productsReviews: execRes
        })
    }

    // now only one param avaal
    @Get('/filtred')
    async getFiltredProductReviews(@Param('productId') id: string, @Res() response: Response) {
        const execRes = await this.productReviewsService.findOne({productId: id})
        response.status(200).json([execRes])
    }

    @Get('/id/:id')
    async getProductReviewsById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        const execRes = await this.productReviewsService.getDocumentById(id)
        response.status(200).send(execRes)
    }

    @Post('/create')
    async createNewProductReview(@Body() data: ProductReviewsEntity, @Res() response: Response) {
        const execRes = await this.productReviewsService.createDocument(data)
        response.status(200).json(execRes)
    }
}
