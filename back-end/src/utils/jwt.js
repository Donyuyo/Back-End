import jwt from 'jsonwebtoken';
import varenv from '../dotenv.js';
import logger from './logger.js';

export const generateToken = (user) => {
    // 1°: Objeto de asociacion del token (Usuario)
    // 2°: Clave privada del cifrado
    // 3°: Tiempo de expiracion
    const token = jwt.sign({ user }, varenv.jwt_secret, { expiresIn: '12h' });
    return token;
}

const token = generateToken({
    "_id": "660b7574408f512ef2e03065",
    "first_name": "Rodrigo Elzo",
    "last_name": " ",
    "password": "$2b$12$wQogjGCpjbbGbCaRmHMrwurQRv8Rx4cprY5vFBgjyA6anq95cHHJm",
    "age": 18,
    "email": "rodrigoelzo.leon@gmail.com",
    "rol": "User",
    "__v": 0
});

logger.info(`Generated token: ${token}`);
