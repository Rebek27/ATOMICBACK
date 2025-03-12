import * as mongoose from 'mongoose';

const EventosSchema = new mongoose.Schema({
    correo: {type:String},
    idEvento:{type:String},
    titulo: {type:String},
    descripcion: {type:String},
    fechaInicio: {type:Date},
    fechaFin: {type:Date},
    recordatorio: {type:Boolean},
    repeticion: {type:String},
    Activo: {type:Boolean,default:true}
});

//Middleware para generar el idEvento
EventosSchema.pre('save',async function(next) {
   if(!this.isNew)return next();
   
   try {
        const count = await this.constructor.countDocuments({correo:this.correo});
        //solucion momentanea pq podria generar problemas de concurrencia despues
        this.idEvento=`${this.correo.substring(0,3)}-${(count+1)>9? '0'+(count+1):(count+1)}`;
        next();
   } catch (error) {
        next(error);
   }
});

export default mongoose.model(
    'eventos',
    EventosSchema,
    'eventos'
);