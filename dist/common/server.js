"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./logger"));
const tunnel = __importStar(require("./tunnel"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const app = express_1.default();
class ExpressServer {
    constructor() {
        const requestLimit = '100kb';
        const sessionSecret = 'secret';
        const root = path_1.default.normalize(__dirname + '/../..');
        tunnel.init();
        console.log('tunnel initialised');
        app.set('appPath', root + 'client');
        app.use(body_parser_1.default.json({ limit: requestLimit || '100kb' }));
        app.use(body_parser_1.default.urlencoded({ extended: true, limit: requestLimit || '100kb' }));
        app.use(body_parser_1.default.text({ limit: requestLimit || '100kb' }));
        app.use(cookie_parser_1.default(sessionSecret));
        app.use(express_1.default.static(`${root}/public`));
        this.configureNunjucks();
    }
    router(routes) {
        // installValidator(app, routes);
        return this;
    }
    // TODO: Hard-coded 8080 for now, until we have environmental
    // variables in our pipeline.
    listen(p = 3000) {
        const welcome = port => () => logger_1.default.info(`up and running in @: ${os_1.default.hostname()} on port: ${port}}`);
        http_1.default.createServer(app).listen(p, welcome(p));
        return app;
    }
    configureNunjucks() {
        var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/templates' : 'templates';
        nunjucks_1.default.configure(_templates, {
            autoescape: true,
            cache: false,
            express: app
        });
        // Set Nunjucks as rendering engine for pages with .html suffix
        app.engine('html', nunjucks_1.default.render);
        app.set('view engine', 'html');
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map