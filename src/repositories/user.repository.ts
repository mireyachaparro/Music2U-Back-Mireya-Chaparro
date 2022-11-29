import { User, UserModel } from '../entities/user.entity';
import { passwordEncrypt } from '../services/auth';

export type id = number | string;

export class UserRepository {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = UserModel;

    async getAll(): Promise<Array<User>> {
        const result = this.#Model.find();
        return result;
    }

    async get(id: id): Promise<User> {
        const result = await this.#Model.findById(id);
        if (!result) throw new Error('ID not found');
        return result;
    }

    async post(data: Partial<User>): Promise<User> {
        if (typeof data.password !== 'string')
            throw new Error('Invalid password format');
        if (data.password === '') throw new Error('Password not entered');
        data.password = await passwordEncrypt(data.password);
        const result = await this.#Model.create(data);
        return result;
    }

    async find(search: Partial<User>): Promise<User> {
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('ID not found');
        return result;
    }

    async patch(id: id, data: Partial<User>): Promise<User> {
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('ID not found');
        return result;
    }

    // async delete(id: id): Promise<void>{
    //     const result = await this.#Model.findByIdAndDelete(id);
    //     if(result === null) throw new Error("ID not found");
    //     return result;
    // }
}
