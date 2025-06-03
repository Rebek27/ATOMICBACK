import * as mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    nombre: {type:String},
    apellidos: {type:String},
    correo: {type:String,unique:true},
    nombreUsuario: {type:String},
    contrasena: {type:String},
    edad: {type:Number},
    ocupacion: {type:String},
    imagen: {type:String},
    verificado:{type:Boolean,default:false}, //para la verificacion de usuario
    tokenVer:{type:String},
    expirToken:{type:Date},
    Activo:{type:Boolean,default:true}
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.contrasena = await bcrypt.hash(this.contrasena, salt);
      next();
    } catch (error) {
      next(error);
    }
});

export default mongoose.model(
    'usuarios',
    userSchema,
    'usuarios'
);