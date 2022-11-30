import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { UserModel } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('Given an instance of RobotRepository', () => {
    const mock = [{ name: 'first' }, { name: 'second' }];
    const setUpCollection = async () => {
        await dbConnect();
        await UserModel.deleteMany();
        await UserModel.insertMany(mock);
        const data = await UserModel.find();
        return [data[0].id, data[1].id];
    };

    const repository = UserRepository.getInstance();

    const malformed = '1';
    const invalid = '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });

    describe('when it call getAll and it call Model.find', () => {
        test('then it returns all users in the collection', async () => {
            const spyMmodel = jest.spyOn(UserModel, 'find');
            const result = await repository.getAll();
            expect(spyMmodel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mock[0].name);
        });
    });

    describe('when it call get and it call Model.findById', () => {
        const spyModel = jest.spyOn(UserModel, 'findById');

        test('then if ID is valid, it returns this user', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mock[0].name);
        });

        test('then if ID is malformed, it throws an error', async () => {
            expect(async () => {
                await repository.get(malformed);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('then if ID is invalid, it throws an error', async () => {
            expect(async () => {
                await repository.get(invalid);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    //test de findone
    // describe('when it call find and it call Model.findOne', () => {

    //     const spyModel = jest.spyOn(UserModel, 'find');

    //     test("when ")
    // });

    describe('when it call post and it call Model.create', () => {
        const spyModel = jest.spyOn(UserModel, 'create');
        test('then if data is valid, it returns the new user', async () => {
            const newUser = {
                name: 'mireya',
                last_name: 'chaparro',
                email: 'mireya@gmail.com',
                password: '12345',
            };
            //no funciona, ¿es porque no esta encriptando la password?
            const result = await repository.post(newUser);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(newUser.name);
        });
    });
});
