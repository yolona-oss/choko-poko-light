import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubCategoryDocument = SubCategoryEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class SubCategoryEntity {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true})
    category: mongoose.Schema.Types.ObjectId;

    @Prop({type: String, required: true})
    subCat: string;
}
const SubCategorySchema = SchemaFactory.createForClass(SubCategoryEntity);

SubCategorySchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { SubCategorySchema }
