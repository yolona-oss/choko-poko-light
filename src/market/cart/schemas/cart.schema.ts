import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = CartEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class CartEntity {
    @Prop({type: String, required: true})
    productTitle: string;

    @Prop({type: String, required: true})
    image: string;

    @Prop({type: Number, required: true})
    rating: number;

    @Prop({type: Number, required: true})
    price: number;

    @Prop({type: Number, required: true})
    quantity: number;

    @Prop({type: Number, required: true})
    subTotal: number;

    @Prop({type: String, required: true})
    productId: string;

    //@Prop({type: String, required: true})
    //productId: string;

    @Prop({type: Number, required: true})
    countInStock: number;

    @Prop({type: String, required: true})
    userId: string
}
const CartSchema = SchemaFactory.createForClass(CartEntity);

CartSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { CartSchema }
