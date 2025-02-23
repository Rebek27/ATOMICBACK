import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: {type:String,required:true},
    apellidos: {type:String,required:true},
    correo: {type:String,required:true},
    edad:{type:Number,required:true},
    objetivos_user:[{
        idObjetivo:{type:String,required:true},
        descripcion:{type:String},
        fechaInicio:{type:Date,default:Date.now},
        estado: { type: String, enum: ['Pendiente', 'En Progreso', 'Completado'], default: 'Pendiente' },
        prioridad:{type:String,enum:['Alta','Media','Baja']}
    }],
    detail_row:{
        FechaReg:{type:Date,default:Date.now},
        UsuarioReg:{type:String},
        FechaUltMod:{type:Date,default:Date.now},
        UsuarioMod:{type:String},
        Activo:{type:Boolean,default:true},
        Borrado:{type:Boolean,default:false}
    }
});

export default mongoose.model(
    'usuarios',
    userSchema,
    'usuarios'
);