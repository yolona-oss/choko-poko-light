import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductRAMsDocument = ProductRAMs & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductRAMs {
    @Prop({type: String, default: null})
    productRam: string
}
const ProductRAMsSchema = SchemaFactory.createForClass(ProductRAMs);

ProductRAMsSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductRAMsSchema }
