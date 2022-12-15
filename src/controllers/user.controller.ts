import { NextFunction, Response, Request } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { createToken, passwordValidate } from '../services/auth.js';
import { RequestPayload } from '../middlewares/interceptors.js';

export class UserController {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly albumRepository: AlbumRepository
    ) {}

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepository.post(req.body);
            res.status(201);
            res.json({ user });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepository.find({
                email: req.body.email,
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
            res.json({ user: user, token: token });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async addFav(req: RequestPayload, res: Response, next: NextFunction) {
        try {
            if (!req.payload) throw new Error('Invalid payload');
            const album = await this.albumRepository.get(req.params.id);
            const user = await this.userRepository.get(req.payload.id);

            if (user.favorites.includes(album.id))
                throw new Error('este album ya esta en tus favoritos');
            user.favorites.push(album.id);

            const updateUser = await this.userRepository.patch(
                user.id.toString(),
                { favorites: user.favorites }
            );

            res.status(200);
            res.json(updateUser);
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async deleteFav(req: RequestPayload, res: Response, next: NextFunction) {
        try {
            if (!req.payload) throw new Error('not found payload');

            const user = await this.userRepository.get(req.payload.id);

            const album = await this.albumRepository.get(req.params.id);

            const deleteAlbum = user.favorites.filter(
                (song) => song.toString() !== album.id.toString()
            );

            const updateUser = await this.userRepository.patch(
                user.id.toString(),
                { favorites: deleteAlbum }
            );

            res.status(200);
            res.json(updateUser);
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    #controlHTTPError(error: Error) {
        if (error.message === 'ID not found') {
            const httpError = new HTTPError(404, 'Not found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
