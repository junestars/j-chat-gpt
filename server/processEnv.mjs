/**
 * 本文件用于设置环境变量
 */

import { env } from 'node:process';

/**
 * 必要配置。node 服务端口
 */
env.SERVER_PORT = 4545;

/**
 * 必要配置。短信验证码服务地址
 */
env.SMS_CODE_SERVER_URL = '';

/**
 * 必要配置。短信验证码服务账号
 */
env.SMS_CODE_ACCOUNT = '';

/**
 * 必要配置。短信验证码服务密码
 */
env.SMS_CODE_PASSWORD = '';

/**
 * 必要配置。短信验证码服务签名
 */
env.SMS_CODE_SIGN = '';

/**
 * 短信验证码有效时间，单位 ms，如果没有配置，则是 5 分钟
 */
env.SMS_CODE_EXPIRES = 1000 * 60 * 5;

/**
 * 短信验证码发送间隔时间，单位 ms，如果没有配置，则是 0
 */
env.SMS_CODE_INTERVAL = 1000 * 60 * 1;

/**
 * token 有效时间，单位 s，如果没有配置，则是 8 小时
 */
env.TOKEN_EXPIRES = 60 * 60 * 8;

/**
 * open key api
 */
env.OPENAI_API_KEY = '';
