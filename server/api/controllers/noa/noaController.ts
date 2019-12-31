import { NextFunction, Request, Response } from 'express';
import { http } from '../../../http';
import { generateS2sToken } from '../../../s2sTokenGeneration';
import axios, { AxiosInstance } from 'axios'

export interface noaResponse {
    responseCode: number
}

export class NoaController {
    public async authenticate(req: Request, res: Response): Promise<void> {
        
        console.log('req.body', req.body)

       //// res.status(200).send({responseCode: 200});
       try {
            const url = 'https://idam-api.aat.platform.hmcts.net/o/token'
            const options = `grant_type=client_credentials&client_id=xuimowebapp&client_secret=yB71mnPeypP3HlcN&scope=profile roles manage-user create-user`
            const response = await http.post(url, options) as any

            const s2sToken = await generateS2sToken('http://rpe-service-auth-provider-aat.service.core-compute-aat.internal');

            const bearerToken = response.data.access_token;
            axios.defaults.headers.common.Authorization = `Bearer ${bearerToken}`;
            axios.defaults.headers.common.ServiceAuthorization = s2sToken

            const data = {id: '63bdc75b-cc3a-4000-852b-bb218a998ddf'};
            const uid = req.body.caseRef; //'63bdc75b-cc3a-4000-852b-bb218a998ddf';
            const jid = 'DIVORCE';
            const ctid = 'FinancialRemedyForDAC';
            const cid = '1576252262902660';

            const ccUrl = `/caseworkers/${uid}/jurisdictions/${jid}/case-types/${ctid}/cases/${cid}/users`;
            ////axios.defaults.headers.common['user-roles'] = response.data.roles.join();
            const ccdResponse = await http.post(`http://ccd-data-store-api-aat.service.core-compute-aat.internal${ccUrl}`, data);
            ////return ccdResponse.data;

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
