import { logged, RequestPayload } from './interceptors';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error';

describe('given logged middleware', () => {
    describe('when user is no authorize', () => {
        const req: Partial<Request> = {
            get: jest.fn().mockReturnValueOnce(false),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();
        test('then it returns an error', () => {
            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        });
    });

    describe('when user is authorize', () => {
        const req: Partial<RequestPayload> = {
            get: jest
                .fn()
                .mockReturnValueOnce(
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhjYTBhODRiMWE4YjRiMDMzNzA0NyIsIm5hbWUiOiJtaXJleWEiLCJsYXN0X25hbWUiOiJjaGFwYXJybyIsImVtYWlsIjoibWlyZXlhQGdtYWlsLmNvbSIsImlhdCI6MTY2OTk5MzA0MH0.RNVAjxZMapi8uWYdFiTmAzN2Ho4AanlD8LO7FB9MNA8'
                ),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();
        test('then it returns the payload', () => {
            logged(req as RequestPayload, res as Response, next);
            expect(next).toHaveBeenCalled();

            expect(req.payload).toStrictEqual({
                email: 'mireya@gmail.com',
                iat: expect.any(Number),
                id: expect.any(String),
                last_name: 'chaparro',
                name: 'mireya',
            });
        });
    });
});
