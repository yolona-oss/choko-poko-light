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
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviews } from './product-reviews.schema';

@Controller('product/reviews')
export class ProductReviewsController {
    constructor(private productReviewsService: ProductReviewsService) {}

    @Get('/')
    async getProductReviews(@Res() response: Response) {
        try {
            const execRes = await this.productReviewsService.getAllEntities()
            if (execRes) {
                response.status(200).json(execRes)
            } else {
                throw new NotFoundException({cause: "Reviews not found"})
            }
        } catch (e) {
            console.log(e)
            throw new BadRequestException({cause: e})
        }
    }

    @Get('/count')
    async getReviewsCount(@Res() response: Response) {
        try {
            const execRes = await this.productReviewsService.getEntitiesCount()
            if (execRes) {
                response.status(200).json({
                    productsReviews: execRes
                })
            } else {
                response.status(500).json({
                    message: "Cannot retrive reviews",
                    success: false
                })
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Get('/:id')
    async getProductReviewsById(@Param('id') id: string, @Res() response: Response) {
        try {
            const execRes = await this.productReviewsService.getEntityById(id)
            if (execRes) {
                response.status(200).send(execRes)
            } else {
                throw new NotFoundException("Review with given ID not found")
            }
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    @Post('/create')
    async createNewProductReview(@Body() data: ProductReviews, @Res() response: Response) {
        try {
            const execRes = await this.productReviewsService.createEntity(data)
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
