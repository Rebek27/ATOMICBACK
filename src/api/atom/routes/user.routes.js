import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

//---------GET
router.get('/users',userController.getUserList);
router.get('/user/:correo',userController.getUserC);
//VERIFICAR EL CORREO
router.get('/verificar-correo', userController.verificarCorreo);

//-----------POST
router.post('/register',userController.postUser);
//PARA VERIFICAR EL INICIO DE SESIÓN
router.post('/login',userController.iniciarSesion);

//----PUT--Cambiar contraseña
router.put('/cambiar-contrasena',userController.cambiarContra);
//------PUT para cambiar datos de la cuenta
router.put('/cambiar-nomap',userController.cambiarNomAp);
router.put('/cambiar-nomus',userController.cambiarNomUs);
router.put('/cambiar-ocupacion',userController.cambiarOcupacion);

//Agregar los objetivos PUT
router.put('/agregar-objetivo',userController.agregarObjetivo);

//Va a faltar las opciones de eliminar

export default router;