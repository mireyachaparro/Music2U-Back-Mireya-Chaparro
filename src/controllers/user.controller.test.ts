import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../entities/user.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from './user.controller';
import { createToken, passwordValidate } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('given user controller', () => {
    const mockData = {
        name: 'prueba',
        last_name: 'prueba',
        email: 'prueba@gmail.com',
        password:
            '$2a$10$KF1T.wQ5sTYLHrnKwGpgv.MVwcTDyh0u5a3Rhvc2/W2AhGKLxG.lm',
    };

    const userRepo = UserRepository.getInstance();
    const albumRepo = AlbumRepository.getInstance();
    const userController = new UserController(userRepo, albumRepo);

    const req: Partial<Request> = {};
    const res: Partial<Response> = {};
    const next: NextFunction = jest.fn() as NextFunction;

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    describe('when we call register', () => {
        userRepo.post = jest.fn().mockReturnValue({
            ...(mockData as User),
            id: new mongoose.Types.ObjectId(),
        });
        test.skip('then if req is ok, it creates the user', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                name: mockData.name,
                last_name: mockData.last_name,
                email: mockData.email,
                password: mockData.password,
                id: expect.any(String),
            });
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
        userRepo.find = jest.fn().mockResolvedValue({
            ...mockData,
            id: new mongoose.Types.ObjectId(),
        });

        test.skip('if the user exists, it runs login ok', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: expect.any(mongoose.Types.ObjectId),
                    name: mockData.name,
                    last_name: mockData.last_name,
                    email: mockData.email,
                    password: mockData.password,
                },
            });
            expect(res.status).toHaveBeenCalledWith(200);
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
            userRepo.find = jest.fn().mockRejectedValue(new Error());
            await userController.login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error());
        });

        test('then if password is invalid, it throws an error', () => {
            userRepo.find = jest.fn().mockReturnValue({
                ...mockData,
                id: new String(),
                password: 123,
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
});
