"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_agent_1 = require("global-agent");
const globalTunnel = __importStar(require("global-tunnel-ng"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
function init() {
    if (config_1.default.has('proxy.host') && config_1.default.has('proxy.port')) {
        console.log('proxy.host');
        const proxy = {
            host: config_1.default.get('proxy.host'),
            port: parseInt(config_1.default.get('proxy.port'), 10),
        };
        let logMessage = '';
        const MAJOR_NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10);
        if (MAJOR_NODEJS_VERSION >= 10) {
            // `global-agent` works with Node.js v10 and above.
            const globalProxyAgent = global_agent_1.createGlobalProxyAgent();
            logMessage = 'configuring global-agent:';
            globalProxyAgent.HTTP_PROXY = `http://${proxy.host}:${proxy.port}`;
        }
        else {
            // `global-tunnel-ng` works only with Node.js v10 and below.
            logMessage = 'configuring global-tunnel-ng:';
            globalTunnel.initialize(proxy);
        }
        logger_1.default.info('using PROXY => ', logMessage, proxy);
    }
    else {
        console.log('proxy.host2');
        const proxy = {
            host: '172.16.0.7',
            port: 8080,
        };
        globalTunnel.initialize({
            host: proxy.host,
            port: proxy.port,
        });
    }
}
exports.init = init;
//# sourceMappingURL=tunnel.js.map