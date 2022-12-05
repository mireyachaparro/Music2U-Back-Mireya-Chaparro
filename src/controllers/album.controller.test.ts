import { Request, Response, NextFunction } from 'express';
import { dbConnect } from '../db.connect';
import { AlbumModel } from '../entities/album.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from './user.controller';

describe('given album controller', () => {
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
    const userController = new UserController(userRepo, albumRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {};
    const next: NextFunction = jest.fn() as NextFunction;

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    describe('when it calls getAll', () => {
        test('then it returns all data', () => {
            //
        });
    });
});
