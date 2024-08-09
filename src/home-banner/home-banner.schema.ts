import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type HomeBannerDocument = HomeBannerEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class HomeBannerEntity {
    id: mongoose.Schema.Types.ObjectId

    @Prop({type: [String], required: true})
    images: string[];
}
const HomeBannerSchema = SchemaFactory.createForClass(HomeBannerEntity);

HomeBannerSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { HomeBannerSchema }
