import * as mongoose from 'mongoose';

const TareasSchema = new mongoose.Schema({
    correo: {type:String},
    titulo: {type:String},
    descripcion: {type:String},
    fechaLimite: {type:Date},
    completada: {type:Boolean,default:false},
    detail_row:{
        Activo:{type:Boolean,default:true},
        Borrado:{type:Boolean,default:false},
        detail_row_reg:[
            {
                FechaReg:{type:Date,default:Date.now},
                UsuarioReg:{type:String},
                FechaUltMod:{type:Date,default:Date.now},
                UsuarioMod:{type:String},
            }
        ]
    }
});

export default mongoose.model(
    'tareas',
    TareasSchema,
    'tareas'
);