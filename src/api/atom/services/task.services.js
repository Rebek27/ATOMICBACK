import Tareas from "../models/Tareas";
import boom from "@hapi/boom";

// Crear tarea
export const crearTarea = async (tareaData) => {
  try {
    const tarea = new Tareas(tareaData);
    await tarea.save();
    return tarea;
  } catch (error) {
    throw boom.internal('Error al crear la tarea', error);
  }
};

// Obtener tareas
export const obtenerTareas = async (correo) => {
  try {
    const tareas = await Tareas.find({ correo, 'detail_row.Borrado': false });
    return tareas;
  } catch (error) {
    throw boom.internal('Error al obtener las tareas', error);
  }
};

// Actualizar tarea
export const actualizarTarea = async (id, tareaData, correo) => {
  try {
    const tarea = await Tareas.findOneAndUpdate(
      { _id: id, correo },
      tareaData,
      { new: true }
    );
    return tarea;
  } catch (error) {
    throw boom.internal('Error al actualizar la tarea', error);
  }
};

// Eliminar tarea (marcar como borrada)
export const eliminarTarea = async (id, correo) => {
  try {
    const tarea = await Tareas.findOneAndUpdate(
      { _id: id, correo },
      { 'detail_row.Borrado': true },
      { new: true }
    );
    return tarea;
  } catch (error) {
    throw boom.internal('Error al eliminar la tarea', error);
  }
};
