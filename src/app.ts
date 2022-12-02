import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { usersRouter } from './routers/users.js';
import { albumsRouter } from './routers/albums.js';
import { errorManager } from './middlewares/errors.js';

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
    origin: 'trustedwebsite.com',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, res) => {
    res.send('API ALBUMS').end();
});

app.use('/users', usersRouter);
app.use('/albums', albumsRouter);

app.use(errorManager);
