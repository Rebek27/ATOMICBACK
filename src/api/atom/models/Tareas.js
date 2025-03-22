import * as mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    idTarea: { type: String},
    correo: { type: String },
    titulo: { type: String },
    descripcion: { type: String },
    fechaLimite: { type: Date },
    completada: { type: Boolean, default: false },
    Activo: { type: Boolean, default: true }
});

//Middleware para generar el idTarea
TaskSchema.pre('save',async function(next) {
    if(!this.isNew)return next();
 
    try {
         const count = await this.constructor.countDocuments({correo:this.correo});
         //solucion momentanea pq podria generar problemas de concurrencia despues
         this.idTarea=`${this.correo.substring(0,3)}-${(count+1)>9? '0'+(count+1):(count+1)}`;
         next();
    } catch (error) {
         next(error);
    }
 });




export default mongoose.model('tareas', TaskSchema, 'tareas');
