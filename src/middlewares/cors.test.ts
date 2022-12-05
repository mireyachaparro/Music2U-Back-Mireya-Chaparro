import { Request, Response, NextFunction } from 'express';
import { setCors } from './cors';

describe('given cors middleware', () => {
    const res: Partial<Response> = {
        setHeader: jest.fn(),
    };
    const next: NextFunction = jest.fn();
    describe('when origin is "*"', () => {
        const req: Partial<Request> = {
            header: jest.fn().mockReturnValue('*'),
        };
        test('then it set * header', () => {
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalled();
        });
    });

    describe('when origin is "Origin"', () => {
        const req: Partial<Request> = {
            header: jest.fn().mockReturnValue('Origin'),
        };
        test('then it set * header', () => {
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                'Origin'
            );
        });
    });
});
