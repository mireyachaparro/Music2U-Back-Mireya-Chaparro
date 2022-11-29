import {
    getSecret,
    createToken,
    readToken,
    passwordEncrypt,
    passwordValidate,
} from './auth';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import bc from 'bcryptjs';

const mock = {
    id: '1',
    name: 'Mireya',
    last_name: 'Chaparro',
    email: 'mireya@gmail.com',
};

describe('Given "getSecret"', () => {
    describe('when it is not string', () => {
        test('then it should throw an error', () => {
            expect(() => {
                getSecret('');
            }).toThrowError();
        });
    });
});
describe('Given "createToken"', () => {
    describe('when we give the payload to it', () => {
        test('then it creates the token', () => {
            const signSpy = jest.spyOn(jwt, 'sign');
            const result = createToken(mock);
            expect(typeof result).toBe('string');
            expect(signSpy).toHaveBeenCalledWith(mock, SECRET);
        });
    });
});
describe('Given "readToken"', () => {
    describe('when the token is valid', () => {
        test('then it reads the properties of the payload', () => {
            const token = createToken(mock);
            const result = readToken(token);
            expect(result.email).toEqual(mock.email);
        });
    });
    describe('when the token is invalid', () => {
        test('then it should throw an error', () => {
            const token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTB9.DGdcCXGRUS4SaCMyY5RSy-8v9tylvmV_HE1rQJGYJ_55';
            expect(() => {
                readToken(token);
            }).toThrowError('invalid signature');
        });
    });
    describe('when the token is malformed', () => {
        test('then it should throw an error', () => {
            const token = 'token';
            expect(() => {
                readToken(token);
            }).toThrowError('jwt malformed');
        });
    });
    describe('when there is no token', () => {
        test('then it should throw an error', () => {
            const token = '';
            expect(() => {
                readToken(token);
            }).toThrowError('jwt must be provided');
        });
    });
});
describe('given "passwordEncrypt" and "passwordValidate"', () => {
    const spyBcHash = jest.spyOn(bc, 'hash');
    const spyBcCompare = jest.spyOn(bc, 'compare');
    describe('when we call passwordEncrypted', () => {
        test('Bcryptjs.hash should be called', async () => {
            await passwordEncrypt('12345');
            expect(spyBcHash).toHaveBeenCalled();
        });
    });
    describe('when we call "passwordValidate"', () => {
        let hash: string;
        const password = '12345';
        const badPassword = '0';
        beforeEach(async () => {
            hash = await passwordEncrypt(password);
        });
        test('then a valid password should be detected', async () => {
            const result = await passwordValidate(password, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(true);
        });
        test('then an invalid password should be detected', async () => {
            const result = await passwordValidate(badPassword, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
