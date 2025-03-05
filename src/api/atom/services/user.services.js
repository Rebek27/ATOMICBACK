//import { async } from "@babel/runtime/regenerator";
import Users from "../models/Users";
import boom from "@hapi/boom";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../../../config/config";
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
        expiresIn: '1h', // El token expira en 1 hora
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
            throw boom.preconditionRequired('Por favo verifique su correo');
        }

        const token = generarToken(usuario); 
        return token;
    }catch(error){
        throw boom.internal(error);
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

        newUser.nombreUsuario = nom1+nom2;

        await newUser.save();
        //http://localhost:3020/atom
        const enlaceVer = `http://localhost:3020/atom/verificar-correo?token=${token}&correo=${newUser.correo}`;
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

//---------PUT PARA ACTUALIZAR CONTRASEÑA --Falta el control y la ruta
export const putActualizarContra = async (correo,newPass) => {
    try {
        let user = await Users.findOne({correo});

        if(!user){
            throw boom.notFound('La cuenta que busca no existe');
        }
        user.contrasena = newPass;

        return await user.save();
    } catch (error) {
        throw boom.badImplementation('Error al cambiar la contraseña');
    }
}

//-----PUT para cambiar nombre y apellido(excepto correo)
export const actualizarNombreAp = async (correo,nuevosDatos) => {
    try {
        const user = await Users.findOne({correo});
        if(!user){
            throw boom.notFound('Usuario no encontrado');
        }

        if(nuevosDatos.nombre === user.nombre){
            user.nombre = nuevosDatos.nombre;
            user.apellidos = nuevosDatos.apellidos;
        }else if(nuevosDatos.apellidos == user.apellidos){
            user.nombre = nuevosDatos.nombre;
        }

        return await user.save();
    } catch (error) {
        throw error;
    }
}

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
//AGREGAR OBJETIVOS
export const agregarObjetivo = async (correo,objetivo) => {
    try {
        const user = await Users.findOne({correo});
        if (!user) {
            throw boom.notFound('Usuario no encontrado');
        }
        user.objetivos_user.push(objetivo);

        return await user.save();
    } catch (error) {
        throw boom.badRequest(error.message);
    }
}