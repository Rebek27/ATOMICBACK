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
        res.status(501).json({mensaje:error})
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

export const recuperarContra = async (req,res,next) => {
    try {
        const {correo} = req.body;
        console.log(correo);
        const usuario = await UserServices.solicitarRecuperacion(correo);
        if(!usuario){
            return res.status(401).json({mensaje:'Usuario no registrado'});
        }
        res.status(200).json({mensaje:'Solicitud enviada, revisa tu correo'});
    } catch (error) {
        next(error);
    }
}

export const resetPassControl=async (req,res,next) => {
    try {
        const {correo,token} = req.query;
        console.log(correo,token);
        const {contrasena} = req.body;

        if (!correo || !contrasena || !token) {
            return res.status(400).json({ mensaje: 'Correo, nueva contraseña y token son requeridos' });
          }

        const usuario = await UserServices.resetPassServ(correo,contrasena,token);
        if(!usuario) return res.status(401).json({mensaje:'No se pudo actualizar la contraseña'});

        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
}

//ACTUALIZADO
export const cambiarContra = async (req,res,next) => {
    try {
        const { correo } = req.usuario; //Esto lo extrae del token de verificacion
        const {oldPass,newPass} = req.body;
        const usuario = await UserServices.putActualizarContra(correo,oldPass,newPass);

        if(!usuario){
            return res.status(400).json({mensaje:'No se pudo actualizar la contraseña'});
        }

        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}

//Cambios de datos Actualizado
export const cambiarNomAp = async (req,res,next) =>{
    try {
        const {correo} = req.usuario;
        const { nombre,apellidos } = req.body;
        if(!nombre && !apellidos){
            return res.status(400).json({mensaje:'Parametros faltantes para completar la operacion'});
        }
        const nuevosDatos = {
            nombre,
            apellidos
        }

        const usuarioActualizado = await UserServices.actualizarNombreAp(correo,nuevosDatos);
        if(!usuarioActualizado){
            return res.status(400).json({mensaje:'No se pudo actualizar el usuario'});
        }

        return res.status(200).json(usuarioActualizado);
    } catch (error) {
        return res.status(400).json({mensaje:error.message});
    }
}

//Cambiar nombre de usuario ACTUALIZADO
export const cambiarNomUs = async (req,res,next) => {
    try{
        const {correo} = req.usuario;
        const { nombreUsuario } = req.body;
        const usuario = await UserServices.actualizarNomUs(correo,nombreUsuario);

        if(!usuario){
            res.status(401).json({mensaje:'No se pudo actualizar el nombre'});
        }
        return res.status(200).json(usuario);
    }catch(error){
        return res.status(400).json({mensaje:error.message});
    }
}
//cambiar ocupacion ACTUALIZADO
export const cambiarOcupacion = async (req,res,next) => {
    try{
        const {correo} = req.usuario;
        const { ocupacion } = req.body;
        const usuario = await UserServices.actualizarOcupacion(correo,ocupacion);

        if(!usuario){
            res.status(401).json({mensaje:'No se pudo actualizar la ocupacion'});
        }
        return res.status(200).json(usuario);
    }catch(error){
        next(error);
    }
}

//Agregar objetivos INACTIVO
// export const agregarObjetivo = async (req,res,next) => {
//     try {
//         const {correo, descripcion,fechaInicio, estado,prioridad,} = req.body;

//         const nuevoObjetivo = {
//             descripcion,
//             fechaInicio,
//             estado,
//             prioridad,
//         }

//         const us = await UserServices.agregarObjetivo(correo,nuevoObjetivo);
//         if (!us) {
//             throw boom.badRequest('No se pudo agregar el objetivo');
//         }

//         return res.status(200).json(us);
//     } catch (error) {
//         next(error);
//     }
// }