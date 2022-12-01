import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AlbumRepository } from '../repositories/album.repository';
import { UserRepository } from '../repositories/user.repository';

export const userRouter = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    AlbumRepository.getInstance()
);

userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
