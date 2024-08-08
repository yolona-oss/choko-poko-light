import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductRAMsDocument = ProductRAMsEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductRAMsEntity {
    @Prop({type: String, default: null})
    productRam: string
}
const ProductRAMsSchema = SchemaFactory.createForClass(ProductRAMsEntity);

ProductRAMsSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductRAMsSchema }
