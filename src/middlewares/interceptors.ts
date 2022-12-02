import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error';
import { readToken } from '../services/auth';
import { AlbumRepository } from '../repositories/album.repository';
export interface RequestPayload extends Request {
    payload?: JwtPayload;
}

export const logged = (req: Request, res: Response, next: NextFunction) => {
    const authveri = req.get('Authorization');
    let payload: RequestPayload;
    if (!authveri || !authveri?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'User or password incorrect'));
        return;
    }
    try {
        let payload: RequestPayload;
        const token = authveri.slice(7);
        readToken(token);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};

export const registered = async (
    req: Request,
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
