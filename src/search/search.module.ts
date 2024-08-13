import { Module } from '@nestjs/common';
import { ProductsModule } from './../market/products/products.module';
import { SearchController } from './search.controller';

@Module({
    imports: [ProductsModule],
    controllers: [SearchController]
})
export class SearchModule {}
