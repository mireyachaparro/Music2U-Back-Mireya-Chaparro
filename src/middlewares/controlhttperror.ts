import { HTTPError } from '../interfaces/error';

export const controlHTTPError = (error: Error) => {
    if (error.message === 'ID not found') {
        const httpError = new HTTPError(404, 'Not found', error.message);
        return httpError;
    }
    const httpError = new HTTPError(503, 'Service unavailable', error.message);
    return httpError;
};
