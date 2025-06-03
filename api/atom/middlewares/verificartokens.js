import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import config from '../../../src/config/config.js';


export function verificarToken(req,res,next){
    const authHeader = req.header('Authorization');

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(boom.unauthorized('Acceso denegado, token de sesion no proporcionado'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const descifrado = jwt.verify(token,config.JWT_SECRET);
        req.usuario = descifrado;
        console.log(descifrado);
        next();
    } catch (error) {
        next(boom.unauthorized('Token Invalido'));
    }
};