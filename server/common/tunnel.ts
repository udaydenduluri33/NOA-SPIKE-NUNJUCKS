import { createGlobalProxyAgent } from 'global-agent';
import * as globalTunnel from 'global-tunnel-ng';
import config from 'config';
import l from './logger';

export function init() {
    if (config.has('proxy.host') && config.has('proxy.port')) {
        console.log('proxy.host');
        const proxy = {
            host: config.get<string>('proxy.host'),
            port: parseInt(config.get<string>('proxy.port'), 10) as number,
        };

        let logMessage = '';
        const MAJOR_NODEJS_VERSION = parseInt(process.version.slice(1).split('.')[0], 10);

        if (MAJOR_NODEJS_VERSION >= 10) {
            // `global-agent` works with Node.js v10 and above.
            const globalProxyAgent = createGlobalProxyAgent();
            logMessage = 'configuring global-agent:';
            globalProxyAgent.HTTP_PROXY = `http://${proxy.host}:${proxy.port}`;
        } else {
            // `global-tunnel-ng` works only with Node.js v10 and below.
            logMessage = 'configuring global-tunnel-ng:';
            globalTunnel.initialize(proxy);
        }

        l.info('using PROXY => ', logMessage, proxy);
    } else {
        console.log('proxy.host2');
        const proxy = {
            host: '172.16.0.7',
            port: 8080,
          }
        globalTunnel.initialize({
            host: proxy.host,
            port: proxy.port,
          })
    }
}
