import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { OrderStatus } from './../../../common/enums/order-status.enum';

export type OrdersDocument = OrdersEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class OrdersEntity {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: mongoose.Schema.Types.ObjectId;

    @Prop({type: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, default: 1}
    }], required: true})
    products: {
        product: mongoose.Schema.Types.ObjectId,
        quantity: number
    }[];

    @Prop({type: String, default: OrderStatus.Pending})
    status: string;

    // --- --- --- --- --- --- --- --- --- --- --- //

    // TODO create delivery and payment schema

    @Prop({type: String, required: true})
    address: string;

    @Prop({type: String, required: true})
    pincode: string;

    @Prop({type: String, required: true})
    paymentId: string;

    // --- --- --- --- --- --- --- --- --- --- --- //

    @Prop({type: Date, default: Date.now})
    creationData: Date;

    @Prop({type: Date, required: false})
    closingData?: Date;
}
const OrdersSchema = SchemaFactory.createForClass(OrdersEntity);

OrdersSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { OrdersSchema }
