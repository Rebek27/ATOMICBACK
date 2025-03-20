import { Router } from "express";
import * as EventsController from '../controllers/events.controller';
import { verificarToken } from "../middlewares/verificartokens";

const router = Router();

//CREAR nuevo
router.post('/events',verificarToken,EventsController.addEvent);

//Lista de eventos del usuario TODOS 
router.get('/events',verificarToken,EventsController.eventList);
//EVENTOS PROXIMOS No se va a usar creo
router.get('/events-proximos',EventsController.eventsProx);
//EVENTOS PASADOS 
router.get('/events-vencidos',EventsController.pastEvents);

//Detalles de un solo evento
router.get('/events/:id',verificarToken,EventsController.eventDetails);

//Actualizar los datos de un evento
router.put('/events/:id',verificarToken,EventsController.updateEvent);
//Eliminar un evento 
router.delete('/events/:id',verificarToken,EventsController.deleteEvent);

export default router;