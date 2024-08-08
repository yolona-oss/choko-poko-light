import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductSizeDocument = ProductSizeEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductSizeEntity {
    @Prop({type: String, default: null})
    size: string
}
const ProductSizeSchema = SchemaFactory.createForClass(ProductSizeEntity);

ProductSizeSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductSizeSchema }
