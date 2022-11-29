import { model, Schema, Types } from 'mongoose';

export type ProtoUser = {
    name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone?: string;
    birthday?: string | Date;
    favorites?: Array<Types.ObjectId>;
    possessions?: Array<Types.ObjectId>;
};

export type User = {
    id: Types.ObjectId;
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string | Date;
    favorites: Array<Types.ObjectId>;
    possessions: Array<Types.ObjectId>;
};

export const userSchema = new Schema<User>({
    name: {},
    last_name: String,
    email: String,
    password: String,
    phone: String,
    birthday: String,
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Albums',
        },
    ],
    possessions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Albums',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const UserModel = model<User>('User', userSchema, 'users');
