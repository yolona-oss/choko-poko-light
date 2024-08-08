import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HomeBannerDocument = HomeBanner & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class HomeBanner {
    @Prop({type: [String], required: true})
    images: string[];
}
const HomeBannerSchema = SchemaFactory.createForClass(HomeBanner);

HomeBannerSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { HomeBannerSchema }
