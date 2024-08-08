import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductSizeDocument = ProductSize & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductSize {
    @Prop({type: String, default: null})
    size: string
}
const ProductSizeSchema = SchemaFactory.createForClass(ProductSize);

ProductSizeSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductSizeSchema }
