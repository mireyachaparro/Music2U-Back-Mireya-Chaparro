import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../entities/user.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from './user.controller';
import { createToken, passwordValidate } from '../services/auth.js';
import { RequestPayload } from '../middlewares/interceptors';

jest.mock('../services/auth.js');

describe('given user controller', () => {
    const mockPass =
        '$2a$10$KF1T.wQ5sTYLHrnKwGpgv.MVwcTDyh0u5a3Rhvc2/W2AhGKLxG.lm';
    const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGUwODExYzY4YWExNWIzNDkxODllOCIsIm5hbWUiOiJhbHZhcmljZXBzIiwibGFzdF9uYW1lIjoiYWx2YXJpY2VwcyIsImVtYWlsIjoiYWx2YXJpY2VwcyIsImlhdCI6MTY3MDI1MjY0OH0.NHDCgSbxMtKXfBJ7Nvo36kZ3p1maXUmZOM-pod_Kjrg';
    const mockData = {
        name: 'prueba',
        last_name: 'prueba',
        email: 'prueba@gmail.com',
        password: mockPass,
    };

    const userRepo = UserRepository.getInstance();
    const albumRepo = AlbumRepository.getInstance();
    const userController = new UserController(userRepo, albumRepo);

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
        userRepo.find = jest.fn().mockResolvedValue({
            ...mockData,
            id: new mongoose.Types.ObjectId(),
        });
    });

    describe('when we call register', () => {
        userRepo.post = jest.fn().mockReturnValue({
            ...(mockData as User),
            id: new mongoose.Types.ObjectId(),
        });
        test('then if req is ok, it creates the user', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('then if data is nos ok, it throws an error', async () => {
            userRepo.post = jest.fn().mockRejectedValue(new Error());
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error());
        });
    });

    describe('when we call login', () => {
        test('if the user exists, it runs login ok', async () => {
            req.body = {
                email: mockData.email,
                password: mockPass,
            };

            (passwordValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue(mockToken);
            await userController.login(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('then if data is ok, it creates the token', () => {
            (createToken as jest.Mock).mockReturnValue('token');
            const token = createToken({
                id: '',
                name: '',
                last_name: '',
                email: '',
            });
            expect(token).toBe('token');
        });

        test('then if data is not ok, it throws an error', async () => {
            userRepo.find = jest
                .fn()
                .mockRejectedValue(new Error('ID not found'));
            await userController.login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('then if password is invalid, it throws an error', () => {
            userRepo.find = jest.fn().mockReturnValue({
                ...mockData,
                id: new String(),
                password: mockPass,
            });
            userController.login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error());
        });

        test('then if password is invalid it throws an error', async () => {
            (passwordValidate as jest.Mock).mockResolvedValue(false);
            await userController.login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error());
        });
    });

    describe('when it calls addFav', () => {
        test('then if there isnt any payload, it throws an error', async () => {
            req = {};
            await userController.addFav(
                req as RequestPayload,
                res as Response,
                next
            );

            expect(next).toHaveBeenCalled();
        });
        test('then if there is not any album in favorite, it adds this album to favorites', async () => {
            albumRepo.get = jest.fn().mockResolvedValueOnce({ id: '2421' });
            userRepo.get = jest.fn().mockResolvedValueOnce({
                favorites: [],
                id: '341',
            });
            userRepo.patch = jest.fn().mockResolvedValueOnce({
                name: 'sergio',
            });
            await userController.addFav(
                req as RequestPayload,
                res as Response,
                next
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });
        test('then if we want to add an album yet existent, it throws an error', async () => {
            albumRepo.get = jest.fn().mockResolvedValueOnce({ id: '2421' });
            userRepo.get = jest.fn().mockResolvedValueOnce({
                favorites: ['2421'],
                id: '341',
            });
            userRepo.patch = jest.fn().mockResolvedValueOnce({
                name: 'sergio',
            });
            await userController.addFav(
                req as RequestPayload,
                res as Response,
                next
            );

            expect(next).toHaveBeenCalled();
        });
    });
    describe('When it calls deleteFav', () => {
        test('then if ', async () => {
            res.status = jest.fn().mockReturnValue(200);
            albumRepo.get = jest.fn().mockResolvedValueOnce({ id: '2421' });
            userRepo.get = jest.fn().mockResolvedValueOnce({
                favorites: ['2421'],
                id: '341',
            });
            userRepo.patch = jest.fn().mockResolvedValueOnce({
                name: 'sergio',
            });

            await userController.deleteFav(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });
        test('should first ', async () => {
            req = {};
            albumRepo.get = jest.fn().mockResolvedValueOnce({ id: '2421' });
            userRepo.get = jest.fn().mockResolvedValueOnce({
                favorites: ['2421'],
                id: '341',
            });
            userRepo.patch = jest.fn().mockResolvedValueOnce({
                name: 'sergio',
            });

            await userController.deleteFav(
                req as RequestPayload,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
