import { env } from 'node:process';
import express from 'express';

import jwt from 'jsonwebtoken';
import jwtConfig, { SECRET, ALGORITHM } from './jwtConfig.mjs';

import sendCode from './sendCode.mjs';
import codes from './codes.mjs';

const router = express.Router();

router
    .all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'authorization,Authorization,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'
        );
        res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
        if (req.method.toLowerCase() == 'options') {
            res.sendStatus(200);
        } else {
            next();
        }
    })
    .use('/', jwtConfig)
    .post('/send-code', (req, res) => {
        const { phone } = req.body;
        if (phone?.length !== 11) {
            res.status(400).send({ message: '错误的手机号' });
        } else {
            sendCode(phone)
                .then(({ code, ...data }) => {
                    // 以手机号为 key 存储发送的验证码
                    codes[phone] = code;

                    // 验证码有效期为 5 分钟
                    setTimeout(() => {
                        delete codes[phone];
                    }, 5 * 60 * 1000);

                    res.status(200).send(data);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        }
    })
    .post('/verify-code', (req, res) => {
        const { phone, code } = req.body;
        if (codes[phone] === code) {
            delete codes[phone];

            const token = jwt.sign({ phone, code }, SECRET, {
                expiresIn: 60 * 60 * 8,
                algorithm: ALGORITHM
            });

            res.status(200).send({
                token,
                message: '验证成功',
                error: false,
                statusCode: '000000'
            });
        } else {
            res.status(400).send({ message: '无效的验证码', error: true, statusCode: '000001' });
        }
    })
    .post('/verify-auth', (req, res) => {
        res.status(200).send({ message: '验证成功', error: false, statusCode: '000000', apiKey: env.OPENAI_API_KEY });
    });

export default router;
