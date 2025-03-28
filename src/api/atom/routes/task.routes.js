import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
//import { verificarToken } from '../../../middlewares/verificartokens.js';

const router = Router();

router.post('/tasks', /*verificarToken,*/ taskController.createTask);
router.get('/tasks', /* verificarToken, */taskController.getTasks);
router.get('/tasks/:id', /* verificarToken, */taskController.getTaskById);
router.put('/tasks/:id',/* verificarToken, */ taskController.updateTask);
router.delete('/tasks/:id',/*  verificarToken, */ taskController.deleteTask);

export default router;
