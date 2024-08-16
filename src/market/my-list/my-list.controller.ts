import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MyListService } from './my-list.service';
import { Response } from 'express';

@Controller('my-list')
export class MyListController {
    constructor(
        private readonly myListService: MyListService
    ) {}

    @Get('/')
    async get(@Query() query: any, @Res() response: Response) {
        const docs = await this.myListService.findFiltredWrapper(query)
        response.json(docs)
    }

    @Post('/add')
    async addToUser(@Query() query: any, @Res() response: Response) {
        const doc = await this.myListService.addToUser(query.productId, query.userId)
        response.json(doc)
    }

    @Post('/remove')
    async removeFromUser(@Query() query: any, @Res() response: Response) {
        // TODO create removeMany handler
        const doc = await this.myListService.removeFromUser(query.productId, query.userId)
        response.json(doc)
    }
}
