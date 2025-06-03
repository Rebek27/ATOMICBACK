import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { verificarToken } from "../middlewares/verificartokens.js";

const router = Router();

//---------GET
router.get('/users',userController.getUserList);
router.get('/user/:correo',verificarToken,userController.getUserC);
//VERIFICAR EL CORREO
router.get('/verificar-correo', userController.verificarCorreo);

//-----------POST
router.post('/register',userController.postUser);
//PARA VERIFICAR EL INICIO DE SESIÓN
router.post('/login',userController.iniciarSesion);
//Olvidaste la contraseña
router.post('/recuperar-cuenta',userController.recuperarContra);
//Ahora si el cambio de contraseña
router.put('/reset-password',userController.resetPassControl);

//----PUT--Cambiar contraseña Actualizado
router.put('/cambiar-contrasena',verificarToken,userController.cambiarContra);
//------PUT para cambiar datos de la cuenta Actualizado
router.put('/cambiar-nom',verificarToken,userController.cambiarNom);
router.put('/cambiar-ap',verificarToken,userController.cambiarAp);
router.put('/cambiar-nomus',verificarToken,userController.cambiarNomUs);
router.put('/cambiar-ocupacion',verificarToken,userController.cambiarOcupacion);
router.put('/cambiar-imagen',verificarToken,userController.cambiarImagen);

//opciones de eliminar cuenta
router.delete('/user',verificarToken,userController.eliminarCuenta);

export default router;