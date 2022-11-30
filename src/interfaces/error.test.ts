import { MyErrors, HTTPError } from './error';

describe('Given HTTPError class', () => {
    describe('when we have an error', () => {
        let error: MyErrors;
        beforeEach(() => {
            error = new HTTPError(400, 'Test Error', 'Error de prueba');
        });
        test('then the error is a instance of Error class', () => {
            expect(error).toBeInstanceOf(Error);
        });

        test('then the error is a instance of HTTPError class', () => {
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('then the error has the name property', () => {
            expect(error).toHaveProperty('name');
        });

        test('then the error has the name property and it is "Test Error"', () => {
            expect(error.name).toBe('HTTPError');
        });

        test('then the error has the statusCode property', () => {
            expect(error).toHaveProperty('statusCode');
        });

        test('then the error has the statusCode property and it is 400', () => {
            expect(error.statusCode).toBe(400);
        });

        test('then the error has the statusMessage property', () => {
            expect(error).toHaveProperty('statusMessage');
        });

        test('then the error has the statusCode property and it is "Test Error"', () => {
            expect(error.statusMessage).toBe('Test Error');
        });

        test('then the error has the message property', () => {
            expect(error).toHaveProperty('message');
        });

        test('then the error has the message property and it is "Error de prueba"', () => {
            expect(error.message).toBe('Error de prueba');
        });
    });
});
