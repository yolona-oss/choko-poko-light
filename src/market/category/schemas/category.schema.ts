import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = CategoryEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class CategoryEntity {
    @Prop({type: String, required: true})
    name: string;

    @Prop({type: [mongoose.Schema.Types.ObjectId], required: true})
    images: mongoose.Schema.Types.ObjectId[];

    @Prop({type: String, required: true})
    color: string;
}
const CategorySchema = SchemaFactory.createForClass(CategoryEntity);

CategorySchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { CategorySchema }
