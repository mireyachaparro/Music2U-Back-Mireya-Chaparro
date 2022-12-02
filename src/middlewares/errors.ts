import { MyErrors } from '../interfaces/error';
import { Request, Response, NextFunction } from 'express';

export const errorManager = (
    error: MyErrors,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    next();
    let status = error.statusCode || 500;
    if (error.name === 'ValidationError') {
        status = 406;
    }
    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    res.status(status);
    res.json(result);
    res.end();
};
