import { dbConnect } from './db.connect';
import mongoose from 'mongoose';
describe('Given dbConnect function', () => {
    describe('When we connect', () => {
        test('then it should return a typeof mongoose', async () => {
            const result = await dbConnect();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });
    });
    describe("when NODE_ENV is not 'test'", () => {
        test('then', () => {
            process.env.NODE_ENV = 'Final_Project_2022';
            const result = dbConnect();
            expect(result).toBeInstanceOf(Promise);
            mongoose.disconnect();
        });
    });
    describe("when NODE_ENV is 'test'", () => {
        test('then', () => {
            process.env.NODE_ENV = 'TESTING_Final_Project_2022';
            const result = dbConnect();
            expect(result).toBeInstanceOf(Promise);
            mongoose.disconnect();
        });
    });
});
