import { model, Schema, Types } from 'mongoose';

export type ProtoAlbum = {
    name?: string;
    artist?: string;
    image?: string;
    year?: number;
    gender?: string;
    format?: string;
    price?: number;
    sold?: boolean;
    owner?: Types.ObjectId;
};

export type Album = {
    id: Types.ObjectId;
    name: string;
    artist: string;
    image: string;
    year: number;
    gender: string;
    format: string;
    price: number;
    sold: boolean;
    owner: Types.ObjectId;
};

export const albumSchema = new Schema<Album>({
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sold: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

albumSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const AlbumModel = model<Album>('Album', albumSchema, 'albums');
