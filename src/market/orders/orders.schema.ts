import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrdersDocument = OrdersEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class OrdersEntity {
    @Prop({type: String, required: true})
    name: string;

    @Prop({type: String, required: true})
    phoneNumber: string;

    @Prop({type: String, required: true})
    address: string;

    @Prop({type: String, required: true})
    pincode: string;

    @Prop({type: String, required: true})
    amount: string;

    @Prop({type: String, required: true})
    paymentId: string;

    @Prop({type: String, required: true})
    email: string;

    @Prop({type: String, required: true})
    userid: string;

    @Prop({type: [{
        productId: {type: String},
        productTitle: {type: String},
        quantity: {type: Number},
        price: {type: Number},
        image: {type: String},
        subTotal: {type: Number},
    }] })
    products: [
        {
            productId: string
            productTitle: string
            quantity: number
            price: number
            image: string
            subTotal: number
        }
    ]

    @Prop({type: String, default: "pending"})
    status: string; // TODO: maybe enum?

    @Prop({type: Date, default: Date.now})
    date: Date;
}
const OrdersSchema = SchemaFactory.createForClass(OrdersEntity);

OrdersSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { OrdersSchema }
