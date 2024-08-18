import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CartDocument = CartEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class CartEntity {
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
}
const CartSchema = SchemaFactory.createForClass(CartEntity);

CartSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { CartSchema }
