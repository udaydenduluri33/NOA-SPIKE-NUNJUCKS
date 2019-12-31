"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../../../http");
const s2sTokenGeneration_1 = require("../../../s2sTokenGeneration");
const axios_1 = __importDefault(require("axios"));
class NoaController {
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // res.status(200).send({responseCode: 200});
            try {
                const url = 'https://idam-api.aat.platform.hmcts.net/o/token';
                const options = `grant_type=client_credentials&client_id=xuimowebapp&client_secret=yB71mnPeypP3HlcN&scope=profile roles manage-user create-user`;
                const response = yield http_1.http.post(url, options);
                const s2sToken = yield s2sTokenGeneration_1.generateS2sToken('http://rpe-service-auth-provider-aat.service.core-compute-aat.internal');
                const bearerToken = response.data.access_token;
                axios_1.default.defaults.headers.common.Authorization = `Bearer ${bearerToken}`;
                axios_1.default.defaults.headers.common.ServiceAuthorization = s2sToken;
                const headers = {
                    common: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearerToken}`,
                        'ServiceAuthorization': s2sToken
                    }
                };
                const data = { id: '63bdc75b-cc3a-4000-852b-bb218a998ddf' };
                const uid = '63bdc75b-cc3a-4000-852b-bb218a998ddf';
                const jid = 'DIVORCE';
                const ctid = 'FinancialRemedyForDAC';
                const cid = '1576252262902660';
                const ccUrl = `/caseworkers/${uid}/jurisdictions/${jid}/case-types/${ctid}/cases/${cid}/users`;
                //axios.defaults.headers.common['user-roles'] = response.data.roles.join();
                const ccdResponse = yield http_1.http.post(`http://ccd-data-store-api-aat.service.core-compute-aat.internal${ccUrl}`, data);
                //return ccdResponse.data;
                res.send(ccdResponse.data);
            }
            catch (error) {
                axios_1.default.defaults.headers.common.Authorization = null;
                axios_1.default.defaults.headers.common.ServiceAuthorization = null;
                console.log(error);
                return error.status ? res.send(error.status) : error;
            }
        });
    }
}
exports.NoaController = NoaController;
exports.default = new NoaController();
//# sourceMappingURL=noaController.js.map