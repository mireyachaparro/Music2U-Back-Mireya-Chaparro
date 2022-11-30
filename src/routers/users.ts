import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';

export const userRouter = Router();

const controller = new UserController(UserRepository.getInstance());

userRouter.post('/register', controller.register.bind(controller));
