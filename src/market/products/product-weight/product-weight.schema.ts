import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductWeightDocument = ProductWeight & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductWeight {
    @Prop({type: String, default: null})
    productWeight: string
}
const ProductWeightSchema = SchemaFactory.createForClass(ProductWeight);

ProductWeightSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductWeightSchema }
