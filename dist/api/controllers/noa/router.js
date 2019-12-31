"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noaController_1 = __importDefault(require("./noaController"));
/**
 * Apps Routes
 *
 */
exports.default = express_1.default
    .Router({ mergeParams: true })
    .get('/', noaController_1.default.authenticate);
//# sourceMappingURL=router.js.map