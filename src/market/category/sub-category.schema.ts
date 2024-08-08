import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SubCategoryDocument = SubCategory & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class SubCategory {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true})
    category: mongoose.Schema.Types.ObjectId;

    @Prop({type: String, required: true})
    subCat: string;
}
const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

SubCategorySchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { SubCategorySchema }
