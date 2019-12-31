import { Application } from 'express';

import noaRouter from './api/controllers/noa/router';
import healthRouter from './api/controllers/health/router';

export default function routes(app: Application): void {

    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    app.get('/health', healthRouter);
    app.use('/api/noa', noaRouter);
}
