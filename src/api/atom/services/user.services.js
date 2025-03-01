//import { async } from "@babel/runtime/regenerator";
import Users from "../models/Users";
import boom from "@hapi/boom";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../../../config/config";

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
        console.log(usuario.contrasena);
        const contrasenaValidada = await bcrypt.compare(contrasena,usuario.contrasena);
        console.log('resultado de compare',contrasenaValidada);

        if(!contrasenaValidada){
            throw boom.notFound('Contraseña incorrecta :0');
        }

        const token = generarToken(usuario); 
        return token;
    }catch(error){
        throw boom.internal(error);
    }
}

//--------POST
export const postUser = async (paUser) => {
    try {
        const newUser = new Users(paUser);

        return await newUser.save();
    } catch (error) {
        //console.error(error);
        throw error;
    }
}