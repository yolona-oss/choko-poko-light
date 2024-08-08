import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RecentlyViewdDocument = RecentlyViewedEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class RecentlyViewedEntity {
    id: string;

    @Prop({type: String, default: ''})
    prodId: string

    @Prop({type: String, required: true})
    name: string;

    @Prop({type: String, required: true})
    description: string;

    @Prop({type: [String], required: true})
    images: string[];

    @Prop({type: String, default: ''})
    brand: string;

    @Prop({type: Number, default: 0})
    price: number;

    @Prop({type: Number, default: 0})
    oldPrice: number;

    @Prop({type: String, default: ''})
    catName: string;

    @Prop({type: String, default: ''})
    subCatId: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true})
    category: mongoose.Schema.Types.ObjectId;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'})
    subCat: mongoose.Schema.Types.ObjectId;

    @Prop({type: Number, required: true})
    countInStock: number;

    @Prop({type: Number, default: 0})
    rating: number;

    @Prop({type: Boolean, default: false})
    isFeatured: boolean;

    @Prop({type: Number, required: true})
    discount: number;

    @Prop({type: [String], default: null})
    productRam: string[];

    @Prop({type: [String], default: null})
    size: string[];

    @Prop({type: [String], default: null})
    productWeight: string[];

    @Prop({type: Date, default: Date.now})
    dateCreated: Date;
}

const RecentlyViewdSchema = SchemaFactory.createForClass(RecentlyViewedEntity);

RecentlyViewdSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { RecentlyViewdSchema }
