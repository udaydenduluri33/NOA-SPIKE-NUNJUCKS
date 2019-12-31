import Server from './common/server';
import routes from './routes';
// import * as propertiesVolume from '@hmcts/properties-volume';

// propertiesVolume.addTo(config);

export default new Server().router(routes).listen(process.env.PORT || 3000);
