import { dbConnect } from './db.connect';
import mongoose from 'mongoose';

const spyConnect = jest.spyOn(mongoose, 'connect');

describe('Given "dbConnect"', () => {
    afterEach(() => {
        mongoose.disconnect();
    });
    describe('When the enviroment is "test"', () => {
        test('then it sould connect with TESTING_Final_Project_2022 database', async () => {
            process.env.NODE_ENV = 'test';
            const result = await dbConnect();
            expect(spyConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe(
                'TESTING_Final_Project_2022'
            );
        });
    });
    describe("when NODE_ENV is not 'test'", () => {
        test('then it sould connect with Final_Project_2022 database', async () => {
            process.env.NODE_ENV = 'another';
            const result = await dbConnect();
            expect(spyConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe(
                'Final_Project_2022'
            );
        });
    });
});
