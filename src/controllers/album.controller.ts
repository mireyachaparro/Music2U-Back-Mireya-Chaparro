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
            res.json({ albums });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const album = await this.albumRepository.get(req.params.id);
            res.json({ album });
        } catch (error) {
            next(this.#controlHTTPError(error as Error));
        }
    }

    // async post(req: Request, res: Response, next: NextFunction){
    //     try{
    //         if(!req.payload){
    //             throw new Error("Invalid payload");
    //         }
    //         const user = await this.userRepository.get(req.payload.id);
    //         req.body.owner = user.id;
    //         const album = await this.albumRepository.post(req.body);
    //     }catch(error){
    //         //
    //     }
    // }

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
