import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AlbumRepository } from '../repositories/album.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

export const userRouter = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    AlbumRepository.getInstance()
);

userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
