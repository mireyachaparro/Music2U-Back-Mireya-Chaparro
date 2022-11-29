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
