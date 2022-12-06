import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
export interface RequestPayload extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: RequestPayload,
    res: Response,
    next: NextFunction
) => {
    const authveri = req.get('Authorization');

    try {
        if (!authveri || !authveri?.startsWith('Bearer')) {
            throw new HTTPError(403, 'Forbidden', 'User or password incorrect');
        }
        const token = authveri.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};
