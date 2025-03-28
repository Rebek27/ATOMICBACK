import Task from "../models/Tareas";
import boom from "@hapi/boom";
import {getUserC} from "../services/user.services";
// Create a new task

export const crearTarea = async (data) => {
   
    try {
        //extraer el correo del usuario y verificar si se puede crear la tarea
        const {correo} = data;
        //verificar si el usuario existe en cualquier 
        const user = await getUserC(correo);
        if(!user){
            throw boom.badData('Usuario no encontrado');
        }
        //antes de guardar una tarea se ejecuta el middleware para generar el idTarea

        const tarea = new Task(data);
        return await tarea.save();

    } catch (error) {
        throw boom.badImplementation({ message: error.message });
    }
};

// Get all tasks for a specific user
export const obtenerTareas = async (correo) => {
    try {
        return await Task.find({ correo });
    } catch (error) {
        throw boom.badImplementation(error);
    }
};


// Get a specific task by ID
export const obtenerTareaPorId = async (id,correo) => {
    try {

        const tarea = await Task.findOne({idTarea:id,correo});
        if (!tarea) throw boom.notFound("Tarea no encontrada");
        return tarea;
    } catch (error) {
        throw boom.badImplementation(error);
    }
};

// Update a specific task by ID
export const actualizarTarea = async (id, data, correo) => {
    try {
        
        const tarea = await Task.findByIdAndUpdate({id,correo}, data, { new: true });
        if (!tarea) throw boom.notFound("Tarea no encontrada");
        return tarea;
    } catch (error) {
        throw boom.badImplementation(error);
    }
};

// Delete a specific task by ID
export const eliminarTarea = async (id,correo) => {
    try {
        const tarea = await Task.findOne({idTarea:id,correo});
        if (!tarea) throw boom.notFound("Tarea no encontrada");
        tarea.Activo = false;
        await tarea.save();
        return tarea;
        
    } catch (error) {
        throw boom.badImplementation(error);
    }
};
