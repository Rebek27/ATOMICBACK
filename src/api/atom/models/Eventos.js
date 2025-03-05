import * as mongoose from 'mongoose';

const EventosSchema = new mongoose.Schema({
    correo: {type:String},
    titulo: {type:String},
    descripcion: {type:String},
    fechaInicio: {type:Date},
    fechaFin: {type:Date},
    recordatorio: {type:Boolean},
    repeticion: {type:String},
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
    'eventos',
    EventosSchema,
    'eventos'
);