import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoryModule } from './category/category.module';
import { MyListModule } from './my-list/my-list.module';

@Module({
  imports: [CartModule, ProductsModule, OrdersModule, CategoryModule, MyListModule]
})
export class MarketModule {}
