import { Album } from '../entities/album.entity.js';
import { User } from '../entities/user.entity.js';

export type id = number | string;

export interface UserRepoGeneric {
    get: (id: id) => Promise<User>;
    post: (data: Partial<User>) => Promise<User>;
    patch: (id: id, data: Partial<User>) => Promise<User>;
}

export interface AlbumRepoGeneric {
    getAll: () => Promise<Array<Album>>;
    get: (id: id) => Promise<Album>;
    post: (data: Partial<Album>) => Promise<Album>;
    find: (data: Partial<Album>) => Promise<Album>;
    patch: (id: id, data: Partial<Album>) => Promise<Album>;
    delete: (id: id) => Promise<void>;
}
