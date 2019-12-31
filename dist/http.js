"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors'
exports.http = axios_1.default.create({});
axios_1.default.defaults.headers.common['Content-Type'] = 'application/json';
// http.interceptors.request.use(requestInterceptor)
// http.interceptors.response.use(successInterceptor, errorInterceptor)
//# sourceMappingURL=http.js.map