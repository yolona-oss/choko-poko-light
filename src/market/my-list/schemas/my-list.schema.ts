import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MyListDocument = MyListEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class MyListEntity {
    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Product', required: true})
    products: mongoose.Schema.Types.ObjectId[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: mongoose.Schema.Types.ObjectId;

}

const MyListSchema = SchemaFactory.createForClass(MyListEntity)

MyListSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { MyListSchema }
