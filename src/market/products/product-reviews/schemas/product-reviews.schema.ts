import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductReviewsDocument = ProductReviewsEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductReviewsEntity {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true})
    product: mongoose.Schema.Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true})
    user: mongoose.Schema.Types.ObjectId;

    @Prop({type: String, required: true, default: ""})
    review: string;

    @Prop({type: Number, required: true, default: 1})
    customerRating: number;

    @Prop({type: Date, default: Date.now})
    dateCreated: Date;
}
const ProductReviewsSchema = SchemaFactory.createForClass(ProductReviewsEntity);

ProductReviewsSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductReviewsSchema }
