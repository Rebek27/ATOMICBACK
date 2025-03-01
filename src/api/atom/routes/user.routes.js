import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

//---------GET
router.get('/users',userController.getUserList);
router.get('/user/:correo',userController.getUserC);

//-----------POST
router.post('/register',userController.postUser);
//PARA VERIFICAR EL INICIO DE SESIÓN
router.post('/login',userController.iniciarSesion);

export default router;