import { Controller, Param, Get, Put, Query, Res } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Response } from 'express';

import { ParseObjectIdPipe } from './../../common/pipes/parse-object-id.pipe';

import { AuthUser } from './../../common/decorators/user.decorator';
import { IJwtPayload } from 'auth/interfaces/jwt-payload.interface';

@Controller()
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService
    ) {}

    @Get('/all')
    async get(
        @Query() query: any, @Res() response: Response
    ) {
        const docs = await this.wishlistService.findFiltredWrapper(query)
        response.status(200).json(docs)
    }

    @Get('/')
    async getUserWishlist(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.findByUser(user.id)
        response.status(200).json(doc)
    }

    @Get('/is-added')
    async isContainsProduct(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const isAdded = await this.wishlistService.isContainsProduct(user.id, productId)
        response.status(200).json({isAdded: isAdded})
    }

    @Put('/add')
    async addToWishlist(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.addToWishlist(user.id, productId)
        response.status(200).json(doc)
    }

    @Put('/remove')
    async removeFromWishlist(
        @AuthUser() user: IJwtPayload,
        @Query('productId', ParseObjectIdPipe) productId: string,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.removeFromWishlist(user.id, productId)
        response.status(200).json(doc)
    }

    @Put('/clear')
    async clearWishlist(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const doc = await this.wishlistService.clearWishlist(user.id)
        response.status(200).json(doc)
    }
}
