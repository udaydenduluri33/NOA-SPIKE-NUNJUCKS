"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./common/server"));
const routes_1 = __importDefault(require("./routes"));
// import * as propertiesVolume from '@hmcts/properties-volume';
// propertiesVolume.addTo(config);
exports.default = new server_1.default().router(routes_1.default).listen(process.env.PORT || 3000);
//# sourceMappingURL=index.js.map