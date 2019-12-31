"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./api/controllers/noa/router"));
function routes(app) {
    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    app.use('/api/noa', router_1.default);
}
exports.default = routes;
//# sourceMappingURL=routes.js.map