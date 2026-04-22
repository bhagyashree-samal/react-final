import axios from 'axios';
import { encryptData, decryptData } from '../utils/crypto';

export const ENV = {
    authBase: 'https://services-encr.iserveu.online/dev/nsdlab-internal',
    userMgmtBase: 'https://services.iserveu.online/dev/nsdlab-internal/user-mgmt',
    camundaBase: 'https://apidev-sdk.iserveu.online/nsdlab/camunda',
    reportsBase: 'https://services-v2.iserveu.online/nsdlab/report',
    uatReportsBase: 'http://bankpratinidhiuat.nsdlbank.co.in/NSDLAB/report',
    featureBase: 'https://apidev-sdk.iserveu.online/nsdlab/dynamicfeature',
    passKey: 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA'
};

const apiClient = axios.create();

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    
    config.headers['pass_key'] = ENV.passKey;
    config.headers['Content-Type'] = 'application/json';
    
    if (token) {
        config.headers['Authorization'] = `Basic ${token}`;
    }

    // Default User-Agent & Geo-Location for auth calls
    config.headers['User-Agent'] = 'Web';
    config.headers['Geo-Location'] = btoa('local');

    return config;
}, error => {
    return Promise.reject(error);
});

export const requestEncrypted = async (url, payload, additionalHeaders = {}) => {
    const encryptedPayload = { RequestData: encryptData(payload) };
    const response = await apiClient.post(url, encryptedPayload, { headers: additionalHeaders });
    
    if (response.data && response.data.ResponseData) {
        return decryptData(response.data.ResponseData);
    }
    return response.data;
};

export const requestPlain = async (url, payload, additionalHeaders = {}) => {
    const response = await apiClient.post(url, payload, { headers: additionalHeaders });
    return response.data;
};

export default apiClient;
