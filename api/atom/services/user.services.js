//import { async } from "@babel/runtime/regenerator";
import Users from "../models/Users.js";
import Eventos from "../models/Eventos.js";
import Tareas from "../models/Tareas.js";
import boom from "@hapi/boom";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../../../src/config/config.js";
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

//FUNCIONES INTERNAS NO EXPORTADAS
function generarToken (usuario) {
    const payload = {
        //id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      };
      // Firma del token
      const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '3h', // El token expira en 1 hora
      });
    
      return token;
}
async function enviarCorreoVer(correo,enlace){ //LO deje aqui porque solo se va a usar en la verificacion del usuario
    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:config.EMAIL_USER,
            pass:config.EMAIL_PASS
        },
    });

    // Contenido del correo
    const mensaje = {
        from: config.EMAIL_USER,
        to: correo,
        subject: 'Verificación de Cuenta Atomic',
        html: `
      <h1>Verifica tu correo electrónico</h1>
      <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href=${enlace}>Verificar Cuenta</a>
      <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
    `,
    };

    // Envía el correo
    await transporter.sendMail(mensaje);
}

async function correoRecuperarContra(correo,enlace){ //LO deje aqui porque solo se va a usar en la verificacion del usuario
    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:config.EMAIL_USER,
            pass:config.EMAIL_PASS
        },
    });

    // Contenido del correo
    const mensaje = {
        from: config.EMAIL_USER,
        to: correo,
        subject: 'Recuperación de Cuenta Atomic',
        html: `
      <h1>Solicitud para recuperacion de contraseña</h1>
      <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href=${enlace}>Verificar Cuenta</a>
      <p>Si no solicitaste esta acción, puedes ignorar este correo.</p>
    `,
    };

    // Envía el correo
    await transporter.sendMail(mensaje);
}

//DEvuelve la lista de usuarios
export const getUsersList = async () => {
    let userList;
    try{
        userList = await Users.find();
        return (userList);
    }catch(error){
        throw boom.internal(error);
    }
} 

export const getUserC = async (correo) => {
    let user;
    try{
        user = await Users.findOne({
            correo:correo,
        });
        return(user);
    }catch(error){
        throw boom.internal(error);
    }
}

export const getValidateUser = async (correo,contrasena) =>{
    try{
        const usuario = await Users.findOne({correo:correo});
        if(!usuario){
            throw boom.notFound('No se encontraron usuarios registrados');
        }
        
        const contrasenaValidada = await bcrypt.compare(contrasena,usuario.contrasena);
        if(!contrasenaValidada){
            throw boom.notFound('Contraseña incorrecta :0');
        }

        if(!usuario.verificado){
            throw boom.preconditionRequired('Por favor verifique su correo');
        }

        const token = generarToken(usuario); 
        return token;
    }catch(error){
        throw error;
    }
}

//--------POST --Agregar usuario
export const postUser = async (paUser) => {
    try {
        const newUser = new Users(paUser);

        // Generar el token de verificación
        const token = crypto.randomBytes(32).toString('hex');
        newUser.tokenVer = token;
        newUser.expirToken = Date.now() + 3600000; // Token expira en 1 hora

        const nom1 = newUser.nombre.split(' ')[0];
        const nom2 = newUser.apellidos.split(' ')[0];

        newUser.nombreUsuario = nom1+" "+nom2;
        newUser.imagen = 'src/assets/profile/Perfil1.png';

        await newUser.save();
        //http://localhost:3020/atom
        const enlaceVer = `${config.FRONTEND_URL}verificar-correo?token=${token}&correo=${newUser.correo}`;
        await enviarCorreoVer(newUser.correo,enlaceVer);

        return newUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//--VERIFICAR CORREO
export const verificarCorreo = async (correo,token) => {
    try {
        const user = await Users.findOne({
            correo:correo,
            tokenVer:token,
            expirToken:{$gt:Date.now()},
        });

        if(!user){
            throw boom.notFound('No se encontraron usuarios registrados');
        }

        user.verificado = true;
        user.tokenVer = undefined;
        user.expirToken = undefined;

        // await user.save();
        
        return await user.save();
    } catch (error) {
        throw error;
    }
}

export const solicitarRecuperacion = async (correo) => {
    try {
        let user = await getUserC(correo);
        if(!user) throw boom.notFound('No se encontró ese usuario');

        // Generar el token de verificación
        const token = crypto.randomBytes(32).toString('hex');
        user.tokenVer = token;
        user.expirToken = Date.now() + 3600000; // Token expira en 1 hora

        await user.save();

        const enlaceVer = `${config.FRONTEND_URL}recuperar-contra?token=${token}&correo=${correo}`;
        await correoRecuperarContra(correo,enlaceVer);

        return user;
    } catch (error) {
        throw boom.internal(error);
    }
}

export const resetPassServ = async (correo,contrasena,token) => {
    try {
        let user = await Users.findOne({
            correo:correo,
            tokenVer:token,
            expirToken:{$gt:Date.now()},
        });
        if(!user) throw boom.notFound('Correo no encontrado o token vencido');

        console.log(user);
        user.contrasena = contrasena;
        user.tokenVer = undefined;
        user.expirToken = undefined;

        return await user.save();
    } catch (error) {
        throw error;
    }
}

//---------PUT PARA ACTUALIZAR CONTRASEÑA --Actualizado
export const putActualizarContra = async (correo,oldPass,newPass) => {
    try {
        let user = await Users.findOne({correo});

        if(!user){
            throw boom.notFound('La cuenta que busca no existe');
        }

        const passValidate = await bcrypt.compare(oldPass,user.contrasena);
        if(!passValidate){
            throw boom.notFound('La contraseña anterior no es correcta');
        }

        user.contrasena = newPass;

        return await user.save();
    } catch (error) {
        throw {mensaje:error.message};
        //return ({mensaje:error.message});
    }
}

//-----PUT para cambiar nombre y apellido(excepto correo) ---------ACTUALIZADO
export const actualizarNombre = async (correo,nuevosDatos) => {
    try {
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

            user.nombre = nuevosDatos.nombre;

        return await user.save();
    } catch (error) {
        throw error;
    }
}

export const actualizarAp = async (correo,nuevosDatos) => {
    try {
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

            user.apellidos = nuevosDatos.apellidos;

        return await user.save();
    } catch (error) {
        throw error;
    }
}


//--------ACTUALIZADO
export const actualizarNomUs = async (correo,nuevoNU) => {
    try{
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

        user.nombreUsuario = nuevoNU;

        return await user.save();
    }catch(error){
        throw error;
    }
}

//----------ACTUALIZADO
export const actualizarOcupacion = async (correo,nuevaOcupacion) => {
    try{
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

        user.ocupacion = nuevaOcupacion;

        return await user.save();
    }catch(error){
        throw error;
    }
}


export const actualizarImagen = async (correo,nuevaImagen) => {
    try{
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

        user.imagen = nuevaImagen;

        return await user.save();
    }catch(error){
        throw error;
    }
}

export const eliminarCuenta = async (correo) =>{
    try{
        const user = await Users.findOneAndDelete({correo:correo});
        
        if(!user){
            throw boom.notFound('Usuario no encontrado.');
        }

        await Eventos.deleteMany({correo:correo});
        await Tareas.deleteMany({correo:correo});

        return user;
    }catch(e){
        return e;
    }
}