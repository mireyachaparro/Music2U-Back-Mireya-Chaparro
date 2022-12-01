import { JwtPayload } from 'jsonwebtoken';

export interface RequestPayload extends Request {
    payload?: JwtPayload;
}
