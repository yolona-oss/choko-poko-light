import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DEFAULT_IMAGES_ENTITY_COLLECTION_NAME } from './../common/constants';

export type ImagesDocument = ImagesEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ImagesEntity {
    id: string;

    @Prop({type: [String], required: true})
    images: string[]

    @Prop({type: String, default: DEFAULT_IMAGES_ENTITY_COLLECTION_NAME})
    collectionName?: string
}

const ImagesSchema = SchemaFactory.createForClass(ImagesEntity);

ImagesSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ImagesSchema }
