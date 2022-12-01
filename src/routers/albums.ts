import { Router } from 'express';
import { AlbumController } from '../controllers/album.controller.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export const albumsRouter = Router();
const controller = new AlbumController(
    AlbumRepository.getInstance(),
    UserRepository.getInstance()
);
albumsRouter.get('/', controller.getAll.bind(controller));
albumsRouter.get('/:id', controller.getAll.bind(controller));
albumsRouter.post('/', controller.getAll.bind(controller));
albumsRouter.patch('/:id', controller.getAll.bind(controller));
albumsRouter.delete('/:id', controller.getAll.bind(controller));
