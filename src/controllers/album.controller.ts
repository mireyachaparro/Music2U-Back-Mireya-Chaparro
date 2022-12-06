import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RequestPayload } from '../middlewares/interceptors.js';

export class AlbumController {
    constructor(
        public readonly albumRepository: AlbumRepository,
        public readonly userRepository: UserRepository
    ) {}
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const albums = await this.albumRepository.getAll();
            res.json(albums);
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const album = await this.albumRepository.get(req.params.id);
            res.status(200);
            res.json({ album });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async post(req: RequestPayload, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepository.get(req.payload.id);
            req.body.owner = user.id;
            const album = await this.albumRepository.post(req.body);

            user.possessions.push(album.id);
            this.userRepository.patch(user.id.toString(), {
                possessions: user.possessions,
            });
            res.status(201);
            res.json(album);
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async patch(req: Request, res: Response, next: NextFunction) {
        try {
            const album = await this.albumRepository.patch(
                req.params.id,
                req.body
            );
            res.json({ album });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.albumRepository.delete(req.params.id);
            res.json({});
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
