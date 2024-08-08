import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//export type UserDocument = HydratedDocument<User>;
export type UserDocument = UserEntity & Document;

@Schema({
    toJSON: {
        virtuals: true
    }
})
export class UserEntity {
    id: string;

    @Prop({required: true, type: String})
    name: string;

    @Prop({required: true, type: String})
    phone: string;

    @Prop({required: true, type: String})
    email: string;

    @Prop({required: true, type: String})
    password: string;

    @Prop({required: true, type: Array<String>})
    images: Array<string>

    @Prop({required: true, default: false})
    isAdmin?: boolean;
}

const UserSchema = SchemaFactory.createForClass(UserEntity);

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

export { UserSchema }
