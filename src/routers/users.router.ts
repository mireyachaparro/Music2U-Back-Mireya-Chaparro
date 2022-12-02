import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export const usersRouter = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    AlbumRepository.getInstance()
);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch('/addFav/:id', controller.addFav.bind(controller));
usersRouter.patch('/deleteFav/:id', controller.deleteFav.bind(controller));
