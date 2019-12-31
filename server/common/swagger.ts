import path from 'path';
import middleware from 'swagger-express-middleware';
import { Application } from 'express';
// import errorHandler from '../api/middlewares/error.handler';
import config from 'config';

export default function(app: Application, routes: (app: Application) => void) {
    middleware(path.join(__dirname, 'api.yml'), app, function(err, middleware) {
        // Enable Express' case-sensitive and strict options
        // (so "/entities", "/Entities", and "/Entities/" are all different)
        app.enable('case sensitive routing');
        app.enable('strict routing');

        app.use(middleware.metadata());
        // app.use(
        //     middleware.files(app, {
        //         apiPath: config.get('swagger.path'),
        //     }),
        // );

        app.use(middleware.parseRequest({}));

        // These two middleware don't have any options (yet)
        app.use(middleware.CORS(), middleware.validateRequest());

        routes(app);

        // eslint-disable-next-line no-unused-vars, no-shadow
        //app.use(errorHandler);
    });
}
