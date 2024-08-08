import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductReviewsDocument = ProductReviews & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ProductReviews {
    @Prop({type: String, required: true})
    productId: string;

    @Prop({type: String, required: true})
    customerName: string;

    @Prop({type: String, required: true})
    customerId: string;

    @Prop({type: String, required: true, default: ""})
    review: string;

    @Prop({type: Number, required: true, default: 1})
    customerRating: number;

    @Prop({type: Date, default: Date.now})
    dateCreated: Date;
}
const ProductReviewsSchema = SchemaFactory.createForClass(ProductReviews);

ProductReviewsSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ProductReviewsSchema }
