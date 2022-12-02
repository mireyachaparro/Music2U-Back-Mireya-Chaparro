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
    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    birthday: {
        type: String,
        required: false,
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Album',
        },
    ],
    possessions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Album',
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
