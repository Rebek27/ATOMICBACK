import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verificarToken } from "../middlewares/verificartokens";

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
router.put('/cambiar-nomap',verificarToken,userController.cambiarNomAp);
router.put('/cambiar-nomus',verificarToken,userController.cambiarNomUs);
router.put('/cambiar-ocupacion',verificarToken,userController.cambiarOcupacion);

//Agregar los objetivos PUT descartado
// router.put('/agregar-objetivo',userController.agregarObjetivo);

//Va a faltar las opciones de eliminar

export default router;