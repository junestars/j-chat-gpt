import axios from 'axios';

// const ErrMap = {
//     ERR_BAD_OPTION_VALUE: 'Error',
//     ERR_BAD_OPTION: 'Error',
//     ECONNABORTED: '请求超时',
//     ETIMEDOUT: '请求超时',
//     ERR_NETWORK: '网络错误',
//     ERR_FR_TOO_MANY_REDIRECTS: '过多的重定向',
//     ERR_DEPRECATED: 'Error: 已弃用',
//     ERR_BAD_RESPONSE: '无可用的响应',
//     ERR_BAD_REQUEST: '无效的请求',
//     ERR_CANCELED: '取消请求',
//     ERR_NOT_SUPPORT: '不支持的协议或 不支持 Blob',
//     ERR_INVALID_URL: '无效的链接'
// };

const service = axios.create({
    timeout: 60 * 1000
});

service.interceptors.response.use(response => {
    const statusCode = response.data?.statusCode;
    if (statusCode === '000000') {
        return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
});

export default service;
