import { Request, Response } from 'express';
import { MyErrors } from '../interfaces/error';
import { errorManager } from './errors';

describe('given errorManager middleware', () => {
    const req = {};
    const res = {
        status: jest.fn().mockReturnValue({}),
        json: jest.fn().mockReturnValue({}),
        end: jest.fn().mockReturnValue({}),
    };
    const next = jest.fn();
    const mockError = {
        statusCode: 500,
        statusMessage: 'error de prueba',
        name: 'error de prueba',
        message: 'esto es un error de prueba',
    };
    describe('when we call it', () => {
        test('then it call next function', () => {
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next
            );
            expect(res.status).toBeCalled();
        });
    });

    describe('when the name of the error is ValidationError', () => {
        test('then it call the next function with a 406 status', () => {
            mockError.name = 'ValidationError';
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next
            );
            expect(res.status).toBeCalled();
        });
    });

    describe('when there is not a status code', () => {
        test('then it should be 500', () => {
            const mocknostatus = {
                name: 'Error',
                statusMessage: 'error',
                message: 'Error',
            };

            errorManager(
                mocknostatus as MyErrors,
                req as Request,
                res as unknown as Response,
                next
            );

            expect(res.status).toBeCalled();
        });
    });
});
