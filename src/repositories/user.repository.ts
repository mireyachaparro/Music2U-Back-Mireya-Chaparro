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

    //no hace falta
    // async getAll(): Promise<Array<User>> {
    //     const result = this.#Model.find();
    //     return result;
    // }

    //esto no hace falta
    async get(id: id): Promise<User> {
        const result = this.#Model.findById(id);
        if (!result) throw new Error('ID not found');
        return result as unknown as Promise<User>;
    }

    async post(data: Partial<User>): Promise<User> {
        if (typeof data.password !== 'string')
            throw new Error('Invalid password format');
        if (data.password === undefined)
            throw new Error('Password not entered');
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    //no hace falta
    async find(search: Partial<User>): Promise<User> {
        const result = this.#Model.findOne(search);
        // if (result === null) throw new Error('ID not found');
        if (!result) throw new Error('ID not found');
        return result as unknown as Promise<User>;
    }

    async patch(id: id, data: Partial<User>): Promise<User> {
        const result = this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('ID not found');
        return result as unknown as Promise<User>;
    }

    //no hace falta
    // async delete(id: id): Promise<void> {
    //     const result = await this.#Model.findByIdAndDelete(id);
    //     if (!result) throw new Error('ID not found');
    //     return;
    // }
}
