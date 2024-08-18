import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImagesDocument = ImagesEntity & Document;

@Schema({
    toJSON: {
        virtuals: true,
    }
})
export class ImagesEntity {
    id: string

    /***
    * Using for accosiate with pre uploaded images.
    * Like default profile image for user or default image for product.
    */
    @Prop({type: String, required: false, unique: true})
    blankType?: string;

    @Prop({type: String, default: "common image"})
    name?: string;

    @Prop({type: String, default: "common image description"})
    description?: string;

    @Prop({type: String, required: true})
    imageUrl: string;
}

const ImagesSchema = SchemaFactory.createForClass(ImagesEntity);

ImagesSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ImagesSchema }
