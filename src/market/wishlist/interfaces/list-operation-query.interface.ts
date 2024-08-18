import mongoose from 'mongoose';

export interface AddToListQuery {
    productId: string | mongoose.Types.ObjectId
    userId: string
}

export interface RemoveFromListQuery {
    productId: string | mongoose.Types.ObjectId
    userId: string
}
