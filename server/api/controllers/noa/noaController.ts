import { NextFunction, Request, Response } from 'express';
import { http } from '../../../http';
import { generateS2sToken } from '../../../s2sTokenGeneration';
import axios from 'axios'

export interface noaResponse {
    responseCode: number
}

export class NoaController {
    public async authenticate(req: Request, res: Response): Promise<void> {
        
        console.log('req.body', req.body)

       //// res.status(200).send({responseCode: 200});
       try {
            const idamSecret = process.env.IDAM_SECRET;
            console.log('idamsecret is', idamSecret);
            const url = 'https://idam-api.aat.platform.hmcts.net/o/token'
            const password = process.env.PASSWORD;
            const email = 'claire_fr_mumford@yahoo.com'
            if(email !== req.body.email) {
                const errorMessage = {
                    message: 'email of the user seems to be different'
                };
                
                return res.render('error.html', errorMessage);
            }
            const options = `username=${email}&password=${password}&grant_type=password&client_id=xuiwebapp&client_secret=${idamSecret}&scope=openid profile roles`

            // const headers = {
            //     'Content-Type': 'application/json'
            // }
            const response = await http.post(url, options) as any

            // console.log('response.data', response.data);

            const s2sToken = await generateS2sToken('http://rpe-service-auth-provider-aat.service.core-compute-aat.internal');

            const bearerToken = response.data.access_token;
            axios.defaults.headers.common.Authorization = `Bearer ${bearerToken}`;
            axios.defaults.headers.common.ServiceAuthorization = s2sToken

            const data = {id: 'fc370ebb-4af1-4733-8a4f-4c4fc8e249ba'};
            const uid = req.body.caseRef; //'63bdc75b-cc3a-4000-852b-bb218a998ddf';
            const jid = 'DIVORCE';
            const ctid = 'DIVORCE';
            const cid = '1567682041533280';

            const ccUrl = `/caseworkers/94785/jurisdictions/${jid}/case-types/${ctid}/cases/${cid}/users`;
            console.log('before');
            ////axios.defaults.headers.common['user-roles'] = response.data.roles.join();
            const ccdResponse = await axios.post(`http://ccd-data-store-api-aat.service.core-compute-aat.internal${ccUrl}`, data);
            ////return ccdResponse.data;

            //const getUrl = `/caseworkers/${uid}/jurisdictions/${jid}/case-types/${ctid}/cases/ids`;

            //const ccdResponse = await axios.get(getUrl);

            console.log('ccdResponse', ccdResponse);

            const confirmation = {
                solicitor_name: '[SOLICITOR NAME]',
                organisation: '[ORGANISATION]'
            }
            res.render('confirmation.html', confirmation);
        } catch (error) {
            axios.defaults.headers.common.Authorization = null;
            axios.defaults.headers.common.ServiceAuthorization = null;
            console.log(error)
            return error.status ? res.send(error.status) : error
        }
    }
}

export default new NoaController();
