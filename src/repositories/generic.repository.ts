import { Album } from '../entities/album.entity';
import { User } from '../entities/user.entity';

export type id = number | string;

export interface UserRepoGeneric {
    getAll: () => Promise<Array<User>>;
    get: (id: id) => Promise<User>;
    post: (data: Partial<User>) => Promise<User>;
    find: (data: Partial<User>) => Promise<User>;
    patch: (id: id, data: Partial<User>) => Promise<User>;
    delete: (id: id) => Promise<void>;
}

export interface AlbumRepoGeneric {
    getAll: () => Promise<Array<Album>>;
    get: (id: id) => Promise<Album>;
    post: (data: Partial<Album>) => Promise<Album>;
    find: (data: Partial<Album>) => Promise<Album>;
    patch: (id: id, data: Partial<Album>) => Promise<Album>;
    delete: (id: id) => Promise<void>;
}
