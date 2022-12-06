import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { RequestPayload } from '../middlewares/interceptors';
import { AlbumRepository } from '../repositories/album.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlbumController } from './album.controller';
import { HTTPError } from '../interfaces/error';

describe('given album controller', () => {
    const mockPass =
        '$2a$10$KF1T.wQ5sTYLHrnKwGpgv.MVwcTDyh0u5a3Rhvc2/W2AhGKLxG.lm';

    const mockAlbum = [
        {
            name: 'prueba',
            artist: 'artista',
            image: '123.jpg',
            year: 2000,
            gender: 'rap',
            format: 'cd',
            price: 10,
        },
        {
            name: 'prueba 2',
            artist: 'artista 2',
            image: '456.jpg',
            year: 2010,
            gender: 'pop',
            format: 'vinilo',
            price: 20,
        },
    ];

    const userRepo = UserRepository.getInstance();
    const albumRepo = AlbumRepository.getInstance();
    const albumController = new AlbumController(albumRepo, userRepo);

    let req: Partial<RequestPayload> = {};
    const res: Partial<Response> = {};
    const next: NextFunction = jest.fn() as NextFunction;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            payload: { id: '3' },
            body: { email: 'algo@gmail.com', password: mockPass },
        };
        res.status = jest.fn().mockReturnValue(201);
        res.json = jest.fn();
        albumRepo.find = jest.fn().mockResolvedValue({
            ...mockAlbum,
            id: new mongoose.Types.ObjectId(),
        });
        albumRepo.getAll = jest.fn();
    });

    describe('when it calls geAll', () => {
        test('then if its ok', async () => {
            await albumController.getAll(
                req as RequestPayload,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });

        test('getall returns error', async () => {
            albumRepo.getAll = jest.fn().mockImplementation(() => {
                throw new HTTPError(404, 'Not found', 'ID not found');
            });
            await albumController.getAll(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('when it calls get', () => {
        test('then if id is valid, it returns this album', async () => {
            albumRepo.get = jest.fn().mockResolvedValueOnce({ id: '2421' });
            await albumController.get(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        test('then if id is invalid, if throws an error', async () => {
            albumRepo.get = jest.fn().mockImplementation(() => {
                throw new HTTPError(404, 'Not found', 'ID not found');
            });
            await albumController.get(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('when it calls post', () => {
        test('then if data is ok, it returns the new album', async () => {
            userRepo.get = jest
                .fn()
                .mockResolvedValue({ id: 1, possessions: [] });
            albumRepo.post = jest.fn().mockResolvedValue({ id: '2' });
            userRepo.patch = jest.fn();

            await albumController.post(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        test('then if data is invalid, it throws an error', async () => {
            userRepo.get = jest.fn();
            req = {};
            await albumController.post(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('when it calls patch', () => {
        test('then if id is valid, it returns the updated album', async () => {
            albumRepo.patch = jest.fn().mockResolvedValue({ id: '' });
            await albumController.patch(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ album: { id: '' } });
        });

        test('ten if id is invalid, it throws an error', async () => {
            albumRepo.patch = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await albumController.patch(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('when it calls delete', () => {
        test('then if id is valid, it returns a empty object', async () => {
            albumRepo.delete = jest.fn();
            await albumController.delete(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        test('then if id is invalid, it throws an error', async () => {
            albumRepo.delete = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await albumController.delete(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
