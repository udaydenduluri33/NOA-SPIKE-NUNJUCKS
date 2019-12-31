import otp from 'otp'
import {http} from './http'

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
export function generateOneTimePassword(s2sSecret) {
  return otp({secret: s2sSecret}).totp();
}

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
export async function generateS2sToken(url) {
  console.log('s2sSecret', s2sSecret);
  const oneTimePassword = generateOneTimePassword(s2sSecret);
  console.info('Generating the S2S token from secret  :', s2sSecret, microservice, oneTimePassword);

  try {

    const s2sTokenResponse = await requestS2sToken(url, microservice, oneTimePassword);
    const s2sToken = s2sTokenResponse.data;
    return s2sToken;
  } catch (error) {
    console.error(`Error generating S2S Token`);
    console.error(`Error generating S2S Token: Status code ${error.status}`);
    console.error(`Error generating S2S Token: path to token generation ${url}`);
    console.error(`Error generating S2S Token: S2S secret ${s2sSecret}`);
    console.error(`Error generating S2S Token: microservice ${microservice}`);

    // TODO: This only passes up strings, in the future it should pass up
    // the object
    throw new Error(ERROR_GENERATING_S2S_TOKEN);
  }
}

/**
 * Request S2S Token
 *
 * @param url - ie. https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @param microservice - xui_webapp
 * @param oneTimePassword - Generated with a one time password generator
 *
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function requestS2sToken(url, microservice, oneTimePassword) {

  return http.post(`${url}/lease`, {
    microservice,
    oneTimePassword,
  });
}
