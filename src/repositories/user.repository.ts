import { User, UserModel } from '../entities/user.entity.js';
import { passwordEncrypt } from '../services/auth.js';
import { UserRepoGeneric, id } from './generic.repository.js';
export class UserRepository implements UserRepoGeneric {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = UserModel;

    async get(id: id): Promise<User> {
        const result = this.#Model.findById(id).populate('possessions');
        return result as unknown as Promise<User>;
    }

    async post(data: Partial<User>): Promise<User> {
        if (!data.password || typeof data.password !== 'string')
            throw new Error('Invalid password format');
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    async find(search: Partial<User>): Promise<User> {
        const result = this.#Model
            .findOne(search)
            .populate('favorites')
            .populate('possessions');
        return result as unknown as Promise<User>;
    }

    async patch(id: id, data: Partial<User>): Promise<User> {
        const result = this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('favorites');

        return result as unknown as Promise<User>;
    }
}
