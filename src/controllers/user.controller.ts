import { NextFunction, Response, Request } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { createToken, passwordValidate } from '../services/auth.js';

export class UserController {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly albumRepository: AlbumRepository
    ) {}

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepository.post(req.body);
            res.status(201).json({ user });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepository.find({
                name: req.body.name,
            });
            const PasswordValid = await passwordValidate(
                req.body.password,
                user.password
            );
            if (!PasswordValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                last_name: user.last_name,
                email: user.email,
            });
            res.status(201);
            res.json({ token });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    #controlHTTPError(error: Error) {
        if ((error as Error).message === 'ID not found') {
            const httpError = new HTTPError(
                404,
                'Not found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
