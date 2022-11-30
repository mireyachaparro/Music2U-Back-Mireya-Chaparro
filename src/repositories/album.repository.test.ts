import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { AlbumModel } from '../entities/album.entity';
import { AlbumRepository } from './album.repository';

describe('Given an instance of AlbumRepository', () => {
    const mock = [
        {
            name: 'album 1',
            price: 10,
            format: 'CD',
            gender: 'Rap',
            year: 2010,
            image: '123.jpg',
            artist: 'SFDK',
        },
        {
            name: 'album 2',
            price: 20,
            format: 'Vinilo',
            gender: 'Rock',
            year: 1980,
            image: '456.jpg',
            artist: 'QUEEN',
        },
    ];
    const setUpCollection = async () => {
        await dbConnect();
        await AlbumModel.deleteMany();
        await AlbumModel.insertMany(mock);
        const data = await AlbumModel.find();
        return [data[0].id, data[1].id];
    };

    const repository = AlbumRepository.getInstance();

    const malformed = '1';
    const invalid = '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });

    describe('when it calls getall and it call Model.find', () => {
        test('then it return all albums in the collection', async () => {
            const spyModel = jest.spyOn(AlbumModel, 'find');
            const result = await repository.getAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mock[0].name);
        });
    });

    describe('when it calls get and it calls Model.findById', () => {
        const spyModel = jest.spyOn(AlbumModel, 'findById');
        test('then if ID is valid, it returns the robot', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mock[0].name);
        });

        test('then if ID is malformed it throws Cast Error', async () => {
            expect(async () => {
                await repository.get(malformed);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('then if ID is invalid, it throws a Validation error', async () => {
            expect(async () => {
                await repository.get(invalid);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('when it calls find and it calls Model.findOne', () => {
        const spyModel = jest.spyOn(AlbumModel, 'findOne');
        test('then if data is valid, it returns the album', async () => {
            const result = await repository.find(mock[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mock[0].name);
        });

        test('then if data is invalid it throws an error', async () => {
            expect(async () => {
                await repository.find({ name: 'invalid' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    // describe("when it calls post and it calls Model.create", () => {
    //     const spyModel = jest.spyOn(AlbumModel, "create");
    //     test("then if data is valid, ite returns the new album", async () => {
    //         const newAlbum = {name: "prueba"}
    //     })
    //     const result = await respository.post(newAlbum);
    // })
});
