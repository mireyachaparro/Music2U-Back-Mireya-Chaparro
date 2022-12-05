import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
import { AlbumRepository } from '../repositories/album.repository.js';
export interface RequestPayload extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: RequestPayload,
    res: Response,
    next: NextFunction
) => {
    const authveri = req.get('Authorization');
    if (!authveri || !authveri?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'User or password incorrect'));
        return;
    }
    try {
        const token = authveri.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};

export const registered = async (
    req: RequestPayload,
    res: Response,
    next: NextFunction
) => {
    const albumRepository = AlbumRepository.getInstance();
    try {
        const album = await albumRepository.get(req.params.id);
        if (!req.payload || album.owner._id.toString() !== req.payload.id) {
            next(new HTTPError(403, 'Forbidden', 'User or password incorrect'));
        }
        next();
    } catch (error) {
        next(error);
    }
};
