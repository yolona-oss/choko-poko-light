import { Document } from "mongoose";
import { OrdersDocument } from "./../schemas/orders.schema";

export interface FiltredOrders {
    orders: Document<unknown, any, OrdersDocument>[],
    totalPages: number,
    page: number
}
