import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageUploadDocument = ImageUpload & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class ImageUpload {
    id: string;

    @Prop({type: [String], required: true})
    images: string[]
}

const ImageUploadSchema = SchemaFactory.createForClass(ImageUpload);

ImageUploadSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { ImageUploadSchema }
