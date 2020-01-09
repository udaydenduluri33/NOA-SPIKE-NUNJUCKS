import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';

import l from './logger';
import * as tunnel from './tunnel';
import nunjucks from 'nunjucks'
import installValidator from './swagger';
import { NoaController } from '../api/controllers/noa/noaController';

const app = express();

export default class ExpressServer {
    constructor() {
        const requestLimit = '100kb';
        const sessionSecret = 'secret';
        const root = path.normalize(__dirname + '/../..');
        tunnel.init();
        console.log('tunnel initialised')
        app.set('appPath', root + 'client');
        app.use(bodyParser.json({ limit: requestLimit || '100kb' }));
        app.use(bodyParser.urlencoded({ extended: true, limit: requestLimit || '100kb' }));
        app.use(bodyParser.text({ limit: requestLimit || '100kb' }));
        app.use(cookieParser(sessionSecret));
        this.configureNunjucks();
    }

    router(routes: (app: Application) => void): ExpressServer {
        installValidator(app, routes);
        return this;
    }

    listen(p: string | number = 3000): Application {
        const welcome = port => () => l.info(`up and running in @: ${os.hostname()} on port: ${port}}`);
        http.createServer(app).listen(p, welcome(p));
        return app;
    }

    configureNunjucks() {
        nunjucks.configure(path.join(__dirname, 'views'), {
            autoescape: true,
            express: app,
            watch: true
          });
        
        
        app.get('/', function(req, res) {
            const data = {
                name: 'Janet Tempest',
                organisation: 'Hamlin and Tinklin Solicitors',
                caseRef: 'fc370ebb-4af1-4733-8a4f-4c4fc8e249ba',
                email: 'claire_fr_mumford@yahoo.com'
            } ;
            res.render('index.html', data);
        });

        app.post('/noa/confirm', new NoaController().authenticate)
    }
}
