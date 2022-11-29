import mongoose from 'mongoose';
import { USER, CLUSTER, PASSWD } from './config';

export async function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test'
            ? 'Final_Project_2022'
            : 'TESTING_Final_Project_2022';
    const uri = `mongodb+srv://${USER}:${PASSWD}@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
    return mongoose.connect(uri);
}
