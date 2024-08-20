import { Controller, Param, Get, Put, Query, Res } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Response } from 'express';

import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';

@Controller()
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService
    ) {}

    @Get('/')
    async get(@Query() query: any, @Res() response: Response) {
        const docs = await this.wishlistService.findFiltredWrapper(query)
        response.status(200).json(docs)
    }

    @Get('/:userId')
    async getUserWishlist(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.findByUser(userId)
        response.status(200).json(doc)
    }

    @Get('/:userId/is-contains')
    async isContainsProduct(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.isContainsProduct(userId, productId)
        response.status(200).json(doc)
    }

    @Put('/:userId/add')
    async addToWishlist(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.addToWishlist(userId, productId)
        response.status(200).json(doc)
    }

    @Put('/:userId/remove')
    async removeFromWishlist(
        @Param('userId', ParseObjectIdPipe) userId: string,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.removeFromWishlist(userId, productId)
        response.status(200).json(doc)
    }

    @Put('/:userId/clear')
    async clearWishlist(
        @Query() query: any,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.clearWishlist(query)
        response.status(200).json(doc)
    }
}
