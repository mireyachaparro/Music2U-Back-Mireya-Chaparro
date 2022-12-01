import { Request, Response, NextFunction } from "express";
import { HTTPError } from "../interfaces/error";
import { AlbumRepository } from "../repositories/album.repository";
import { UserRepository } from "../repositories/user.repository";
import {RequestPayload} from "../middlewares/interceptors"

export class AlbumController {
    constructor(
        public readonly albumRepository: AlbumRepository,
        public readonly userRepository: UserRepository
    ){}
    async getAll(req: Request, res: Response, next: NextFunction){
        try{
            const albums = await this.albumRepository.getAll();
            res.json({albums})
        }catch(error){
            next(this.#controlHTTPError(error as Error));
        }
    }

    async get(req: Request, res: Response, next: NextFunction){
        try{
            const album = await this.albumRepository.get(req.params.id);
            res.json({album});
        }catch(error){
            next(this.#controlHTTPError(error as Error))
        }
    }

    async post(req: Request, res: Response, next: NextFunction){
        try{
            if(!req.payload){
                //
            }
            
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
