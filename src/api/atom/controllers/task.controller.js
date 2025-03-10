import Tareas from "../models/Tareas";

// Crear tarea
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite } = req.body;
    const tarea = await Tareas.create({
      correo: req.user.correo,
      titulo,
      descripcion,
      fechaLimite
    });
    res.status(201).json(tarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

// Obtener tareas
export const getTareas = async (req, res) => {
  try {
    const tareas = await Tareas.find({ correo: req.user.correo, 'detail_row.Borrado': false });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

// Actualizar tarea
export const updateTarea = async (req, res) => {
  try {
    const tarea = await Tareas.findOneAndUpdate(
      { _id: req.params.id, correo: req.user.correo },
      req.body,
      { new: true }
    );
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

// Eliminar tarea (marcar como borrada)
export const deleteTarea = async (req, res) => {
  try {
    await Tareas.findOneAndUpdate(
      { _id: req.params.id, correo: req.user.correo },
      { 'detail_row.Borrado': true }
    );
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};
