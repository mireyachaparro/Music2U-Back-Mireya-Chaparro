import { Router } from 'express';
import { AlbumController } from '../controllers/album.controller.js';
import { logged } from '../middlewares/interceptors.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export const albumsRouter = Router();
const controller = new AlbumController(
    AlbumRepository.getInstance(),
    UserRepository.getInstance()
);
albumsRouter.get('/', controller.getAll.bind(controller));
albumsRouter.get('/:id', logged, controller.get.bind(controller));
albumsRouter.post('/', logged, controller.post.bind(controller));
albumsRouter.patch('/:id', logged, controller.patch.bind(controller));
albumsRouter.delete('/:id', logged, controller.delete.bind(controller));
