import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
export interface RequestPayload extends Request {
    payload?: JwtPayload;
}
