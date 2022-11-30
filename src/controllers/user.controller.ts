import { NextFunction, response, Request } from 'express';
import { HTTPError } from '../interfaces/error';
import { UserRepoGeneric } from '../repositories/generic.repository';
import { createToken, passwordValidate } from '../services/auth';

export class UserController {
    constructor(public readonly repository: UserRepoGeneric) {}

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.post(req.body);
            response.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.find({ name: req.body.name });
            const PasswordValid = await passwordValidate(
                req.body.password,
                user.password
            );
            if (!PasswordValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                last_name: user.last_name,
                email: user.email,
            });
            res.json({ token });
        } catch (error) {
            next(error as Error);
            //para que es ccreate http error?
        }
    }
}
