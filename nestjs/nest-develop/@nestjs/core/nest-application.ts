import express, { Express, Request, Response } from 'express';
import { Logger } from './logger';

export class NestApplication {
    private readonly app: Express = express();

    constructor(protected readonly module: Express) { }

    async init() {

    }

    public async listen(port: number, callback?: () => void) {
        await this.init();
        this.app.listen(port, () => {
            Logger.log(`Application is running on port http://localhost:${port}`, 'NestApplication')
            callback?.();
        });
    }
}