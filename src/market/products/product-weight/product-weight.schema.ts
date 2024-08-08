import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductWeightDocument = ProductWeightEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductWeightEntity {
    @Prop({type: String, default: null})
    productWeight: string
}
const ProductWeightSchema = SchemaFactory.createForClass(ProductWeightEntity);

ProductWeightSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductWeightSchema }
