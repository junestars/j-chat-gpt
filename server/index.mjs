// 需要在最上层导入环境变量设置
import './processEnv.mjs';

import express from 'express';
import router from './router.mjs';
import { env } from 'node:process';

const app = express();

app.use(express.json());

app.use(router);
app.use((error, request, response, next) => {
    if (error.name === 'UnauthorizedError') {
        response.status(401).send({ statusCode: '000002', error: true, message: '无效的 token' });
    }
});

app.listen(env.SERVER_PORT, () => {
    console.log(`服务已启动，请访问：http://localhost:${env.SERVER_PORT}`);
});
