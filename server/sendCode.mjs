import moment from 'moment';
import CryptoJS from 'crypto-js';
import request from './request.mjs';

const BASE_URL = 'https://app.cloopen.com:8883';
const ACCOUNT_SID = '2c94811c8a27cf2d018a8369bbb61ab1';
const AUTH_TOKEN = '5c93a3e987134ff98a3ae7ca1cedbd70';
const APP_ID = '2c94811c8a27cf2d018a8369bce91ab8';
const TEMPLATE_ID = '1';

let timeStamp;

const getTimeStamp = () => moment().format('YYYYMMDDhhmmss');

const getSigParameter = () => {
    timeStamp = getTimeStamp();

    const message = `${ACCOUNT_SID}${AUTH_TOKEN}${timeStamp}`;

    return CryptoJS.MD5(message).toString().toUpperCase();
};

const getAuthorization = () => {
    const str = `${ACCOUNT_SID}:${timeStamp}`;
    const wordArray = CryptoJS.enc.Utf8.parse(str);

    return CryptoJS.enc.Base64.stringify(wordArray);
};

const getUrl = () => {
    const SigParameter = getSigParameter();
    return `${BASE_URL}/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${SigParameter}`;
};

/*
 生成指定长度的随机数
 */
function randomCode(length) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.ceil(Math.random() * 9)];
    }
    return result;
}

const sendCode = async (phoneNumber, code) => {
    code = code || randomCode(4);
    const url = getUrl();
    const authorization = getAuthorization();

    return request({
        url,
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'application/json;charset=utf-8;',
            Authorization: authorization
        },
        data: {
            to: phoneNumber,
            appId: APP_ID,
            templateId: TEMPLATE_ID,
            datas: [code, '1']
        }
    }).then(res => ({ ...res, code }));
};

export default sendCode;
