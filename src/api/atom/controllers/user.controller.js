//import { async } from "@babel/runtime/regenerator";
import Users from "../models/Users";
import * as UserServices from "../services/user.services";
import boom from "@hapi/boom";

//Obtener todos los usuarios
export const getUserList = async (req,res,next) =>{
    try {
        const userList = await UserServices.getUsersList();
        if(!userList){
            throw boom.notFound('No se encontraron usuarios registrados');
        }else{
            res.status(200).json(userList);
        }
    } catch (error) {
        next(error);
    }
};

//Obtener solo un usuario por correo
export const getUserC = async (req,res,next) => {
    try {
        const {correo} = req.params;
        const user = await UserServices.getUserC(correo);

        if(!user){
            throw boom.notFound('No se encontraron usuarios registrados');
        }else{
            res.status(200).json(user);
        }

    } catch (error) {
        next(error);
    }
};

//VALIDAR SESION Lo estoy considerando como POST
export const iniciarSesion = async (req,res,next) =>{
    try {
        const {correo, contrasena} = req.body;
        
        console.log('Correo:',correo);
        console.log('Contra',contrasena);

        const token = await UserServices.getValidateUser(correo,contrasena);

        if(!token){
            throw boom.badData('Credenciales de inicio de sesion invalidas');
        }
        res.json({token});
    } catch (error) {
        next(error);
    }
}

//------POST
export const postUser = async (req,res,next) => {
    try {
        const paUser = req.body;
        const newUser = await UserServices.postUser(paUser);

        if(!newUser){
            throw boom.badRequest('No se pudo agregar el usuario');
        }
        
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Código de error para duplicados en MongoDB
            return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
        }
        next(error);
    }
}

export const verificarCorreo = async (req,res,next) => {
    try {
        const {correo,token} = req.query;
        const usuario = await UserServices.verificarCorreo(correo,token);
        console.log(usuario);
        if(!usuario){
            return res.status(400).json({ mensaje: 'Token inválido o expirado.' });
        }

        res.status(200).json({ mensaje: 'Correo verificado exitosamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const cambiarContra = async (req,res,next) => {
    try {
        const {correo,newPass} = req.body;
        const usuario = await UserServices.putActualizarContra(correo,newPass);

        if(!usuario){
            return res.status(400).json({mensaje:'No se pudo actualizar la contraseña'});
        }

        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}