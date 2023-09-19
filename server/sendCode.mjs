import moment from 'moment';
import request from './request.mjs';
import { env } from 'node:process';

/**
 * 上一次发送验证码的时间
 */
let LAST_REQUEST_TIME = 0;

/**
 * 验证码发送的间隔时间
 */
const INTERVAL_TIME = Number(env.SMS_CODE_INTERVAL) || 0;

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

const sendCode = async (phone, code) => {
    const currentTime = Date.now();

    if (LAST_REQUEST_TIME !== 0 && currentTime - LAST_REQUEST_TIME < INTERVAL_TIME) {
        return Promise.reject({ message: '您的操作过于频繁，请稍后重试', error: true, statusCode: '000003' });
    }

    LAST_REQUEST_TIME = currentTime;

    code = code || randomCode(4);
    const sendtime = moment().format('yyyyMMDDHHmm');

    return request({
        url: process.env.SMS_CODE_SERVER_URL,
        method: 'POST',
        data: {
            phone,
            sendtime,
            account: process.env.SMS_CODE_ACCOUNT,
            password: process.env.SMS_CODE_PASSWORD,
            msg: `【${process.env.SMS_CODE_SIGN}】 ${code} 是您的验证码（5分钟内有效），您正在登陆，切勿泄露，非本人操作请忽略。`
        }
    }).then(res => ({ ...res, code, error: false, statusCode: '000000' }));
};

export default sendCode;
