import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type HomeBannerDocument = HomeBannerEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class HomeBannerEntity {
    id: string

    @Prop({type: String, default: 'Title'})
    title?: string;

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Images', required: true})
    images: mongoose.Schema.Types.ObjectId[];
}

const HomeBannerSchema = SchemaFactory.createForClass(HomeBannerEntity);

HomeBannerSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { HomeBannerSchema }
