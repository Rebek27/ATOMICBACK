import * as taskService from '../services/task.services.js';
// Create a new task
export const createTask = async (req, res, next) => {
    try {
        const {correo} = req.usuario;
        req.body.correo = correo;

        const task = await taskService.crearTarea(req.body);
//desenglosar el cuerpo optional
        if(!task){
            return res.status(400).json({mensaje:'No se pudo crear la tarea'});
        }
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// Get all tasks for a specific user
export const getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.obtenerTareas(req.usuario.correo);
       
        if(!tasks){
            return res.status(400).json({mensaje:'No se encontraron tareas'});
        }
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Get a specific task by ID
export const getTaskById = async (req, res, next) => {
    try {
        const correo = req.usuario.correo;

        const task = await taskService.obtenerTareaPorId(req.params.id,correo);
        
        if(!task){
            return res.status(400).json({mensaje:'No se encontro la tarea'});
        }
    
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Update a specific task by ID
export const updateTask = async (req, res, next) => {
    try {
        const correo = req.usuario.correo;
        const task = await taskService.actualizarTarea(req.params.id, req.body,correo);
        if(!task){
            return res.status(400).json({mensaje:'No se pudo actualizar la tarea'});
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Delete a specific task by ID
export const deleteTask = async (req, res, next) => {
    try {
        const task = await taskService.eliminarTarea(req.params.id,req.usuario.correo);
        if(!task){
            return res.status(400).json({mensaje:'No se pudo eliminar la tarea'});
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};