import { Types } from 'mongoose';
import { Album, AlbumModel, ProtoAlbum } from '../entities/album.entity.js';
import { AlbumRepoGeneric, id } from './generic.repository.js';

export class AlbumRepository implements AlbumRepoGeneric {
    static instance: AlbumRepository;

    public static getInstance(): AlbumRepository {
        if (!AlbumRepository.instance) {
            AlbumRepository.instance = new AlbumRepository();
        }
        return AlbumRepository.instance;
    }

    #Model = AlbumModel;

    async getAll(): Promise<Array<Album>> {
        const result = this.#Model.find().populate('owner', {
            albums: 0,
        });
        return result;
    }

    async get(id: id): Promise<Album> {
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner');
        if (!result) throw new Error('ID not found');
        return result;
    }

    async find(search: Partial<Album>): Promise<Album> {
        const result = await this.#Model.findOne(search).populate('owner', {
            albums: 0,
        });
        if (!result) throw new Error('ID not found');
        return result;
    }

    async post(data: ProtoAlbum): Promise<Album> {
        const result = await (
            await this.#Model.create(data)
        ).populate('owner', { albums: 0 });
        return result;
    }

    async patch(id: id, data: Partial<Album>): Promise<Album> {
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('owner', {
                albums: 0,
            });
        if (!result) throw new Error('ID not found');
        return result;
    }

    async delete(id: id): Promise<void> {
        const result = await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', {
                albums: 0,
            });
        if (!result) throw new Error('ID not found');
        return;
    }
}
