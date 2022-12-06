import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.connect';
import { AlbumModel } from '../entities/album.entity';
import { UserModel } from '../entities/user.entity';
import { createToken, TokenPayload } from '../services/auth';

const setCollection = async () => {
    const mockPass = '12345';
    const usersMock = [
        {
            name: 'prueba uno',
            last_name: 'last name uno',
            email: 'prueba1@gmail.com',
            password: mockPass,
        },
        {
            name: 'prueba dos',
            last_name: 'last name dos',
            email: 'prueba2@gmail.com',
            password: mockPass,
        },
    ];

    //para albums
    // const albumsMock = [
    //     {
    //         name: '',
    //         artist: '',
    //         image: '',
    //         year: 2000,
    //         gender: '',
    //         format: '',
    //         price: 10,
    //     },
    //     {
    //         name: '',
    //         artist: '',
    //         image: '',
    //         year: 2001,
    //         gender: '',
    //         format: '',
    //         price: 20,
    //     },
    // ];
    await UserModel.deleteMany();
    await UserModel.insertMany(usersMock);
    await AlbumModel.deleteMany();
    //para albums
    // await AlbumModel.insertMany(albumsMock);
    const data = await UserModel.find();
    //para albums
    // const dataAlbum = await AlbumModel.find();
    const testIds = [data[0].id, data[1].id];
    //para albums
    // const albumsIds = [dataAlbum[0].id, dataAlbum[1].id];
    //para albums
    // return testIds && albumsIds;
    return testIds;
};

describe('given "app" with "/albums" route', () => {
    describe('when i have connection to mongoDB', () => {
        let token: string;
        let ids: Array<string>;
        beforeEach(async () => {
            await dbConnect();
            ids = await setCollection();
            const payload: TokenPayload = {
                id: ids[0],
                name: 'prueba tres',
                last_name: 'apellido tres',
                email: 'prueba3@gmail.com',
            };
            token = createToken(payload);
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        describe('when it calls the get to /albums', () => {
            test('then it should send status 200', async () => {
                const response = await request(app).get('/albums');
                expect(response.status).toBe(200);
            });
        });

        describe('when it calls the get to url /robots/:id', () => {
            test('then if id is invalid, it sends status 403', async () => {
                const response = await request(app).get('/albums/23');
                expect(response.status).toBe(403);
            });
        });

        describe('when it calls the post to url /robots/:id', () => {
            test('then if user is not authorize, it sends status 403', async () => {
                const response = await request(app)
                    .post('/albums/')
                    .send({ name: 'album created' });
                expect(response.status).toBe(403);
            });

            test.skip('then if user is authorize, it sends status 201', async () => {
                const response = await request(app)
                    .post('/albums/')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: '',
                        artist: '',
                        image: '',
                        year: 2000,
                        gender: '',
                        format: '',
                        price: 10,
                        owner: expect.any(mongoose.Schema.Types.ObjectId),
                    });
                expect(response.status).toBe(201);
            });
        });

        describe('when it calls the delete to url /robots/:id', () => {
            test('then if user is not authorize, it sends status 403', async () => {
                const response = await request(app).delete('/albums/23');
                expect(response.status).toBe(403);
            });

            //aqui hay que poner un id de un album que exista, para eso hay que hacer lo mismo que para los usuarios, pero no se como se hace para reotnrar los dos clases de ids sin que de error
            test.skip('then if user is authorize, it sends status 200', async () => {
                const response = await request(app)
                    .delete('/albums/6388e24d238fcf65c01d2a2c')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
        });
    });
});
