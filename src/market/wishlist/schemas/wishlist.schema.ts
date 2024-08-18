import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type WishlistDocument = WishlistEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class WishlistEntity {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: mongoose.Schema.Types.ObjectId;

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Product', required: true})
    products: mongoose.Schema.Types.ObjectId[];
}

const WishlistSchema = SchemaFactory.createForClass(WishlistEntity)

WishlistSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { WishlistSchema }
