export interface MyErrors extends Error {
    statusCode: number;
    statusMessage: string;
}

export class HTTPError extends Error implements MyErrors {
    constructor(
        public statusCode: number,
        public statusMessage: string,
        public message: string,
        public options?: ErrorOptions
    ) {
        super(message, options);
        this.name = 'HTTPError';
    }
}
