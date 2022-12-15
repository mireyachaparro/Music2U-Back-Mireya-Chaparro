import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { usersRouter } from './routers/users.router.js';
import { albumsRouter } from './routers/albums.router.js';
import { errorManager } from './middlewares/errors.js';

export const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API ALBUMS').end();
});

app.use('/users', usersRouter);
app.use('/albums', albumsRouter);

app.use(errorManager);
