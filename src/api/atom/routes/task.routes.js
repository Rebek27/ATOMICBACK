import { Router } from "express";
import * as tareaController from "../controllers/tarea.controller";

const router = Router();

//---------GET
router.get('/tareas', tareaController.getTareas);

//-----------POST
router.post('/crear-tarea', tareaController.crearTarea);

//-----------PUT
router.put('/actualizar-tarea/:id', tareaController.updateTarea);

//-----------DELETE
router.delete('/eliminar-tarea/:id', tareaController.deleteTarea);

export default router;
