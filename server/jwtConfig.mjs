import { expressjwt } from 'express-jwt';

export const SECRET = 'JUNE_CHAT_GPT';
export const ALGORITHM = 'HS256';

const unlessPath = ['/send-code', '/verify-code'];

export default expressjwt({
    secret: SECRET,
    algorithms: [ALGORITHM]
}).unless({
    path: unlessPath
});
