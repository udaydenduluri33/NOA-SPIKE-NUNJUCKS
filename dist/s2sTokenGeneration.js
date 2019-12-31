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
const otp_1 = __importDefault(require("otp"));
const http_1 = require("./http");
const s2sSecret = process.env.S2S_SECRET || 'S2S SECRET NEEDS TO BE SET';
const microservice = 'xui_webapp';
const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token';
/**
 * Generate One Time Password
 *
 * With our S2S Secret we generate a one time password. This S2S secret is used to get our our S2S Token.
 *
 * @param s2sSecret
 * @returns {any}
 */
function generateOneTimePassword(s2sSecret) {
    return otp_1.default({ secret: s2sSecret }).totp();
}
exports.generateOneTimePassword = generateOneTimePassword;
/**
 * Return a generated S2S Token
 *
 * Note we do not rely on Idam to generate an S2S Token. Therefore it can be outside of any Idam authentication
 * layer.
 *
 * @microservice xui_webapp
 * @url https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @returns {string}
 */
function generateS2sToken(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('s2sSecret', s2sSecret);
        const oneTimePassword = generateOneTimePassword(s2sSecret);
        console.info('Generating the S2S token from secret  :', s2sSecret, microservice, oneTimePassword);
        try {
            const s2sTokenResponse = yield requestS2sToken(url, microservice, oneTimePassword);
            const s2sToken = s2sTokenResponse.data;
            return s2sToken;
        }
        catch (error) {
            console.error(`Error generating S2S Token`);
            console.error(`Error generating S2S Token: Status code ${error.status}`);
            console.error(`Error generating S2S Token: path to token generation ${url}`);
            console.error(`Error generating S2S Token: S2S secret ${s2sSecret}`);
            console.error(`Error generating S2S Token: microservice ${microservice}`);
            // TODO: This only passes up strings, in the future it should pass up
            // the object
            throw new Error(ERROR_GENERATING_S2S_TOKEN);
        }
    });
}
exports.generateS2sToken = generateS2sToken;
/**
 * Request S2S Token
 *
 * @param url - ie. https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @param microservice - xui_webapp
 * @param oneTimePassword - Generated with a one time password generator
 *
 * @returns {Promise<AxiosPromise<any>>}
 */
function requestS2sToken(url, microservice, oneTimePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return http_1.http.post(`${url}/lease`, {
            microservice,
            oneTimePassword,
        });
    });
}
exports.requestS2sToken = requestS2sToken;
//# sourceMappingURL=s2sTokenGeneration.js.map