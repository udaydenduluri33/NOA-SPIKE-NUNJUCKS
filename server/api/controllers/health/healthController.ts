import { NextFunction, Request, Response } from 'express';

export class HealthController {
    public async health(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.send(200);
    }
}

export default new HealthController();