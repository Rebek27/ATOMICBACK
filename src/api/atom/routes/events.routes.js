import { Router } from "express";
import * as EventsController from '../controllers/events.controller';

const router = Router();

//CREAR nuevo
router.post('/events',EventsController.addEvent);

//Lista de eventos del usuario TODOS 
router.get('/events',EventsController.eventList);
//EVENTOS PROXIMOS
router.get('/events-proximos',EventsController.eventsProx);
//EVENTOS PASADOS 
router.get('/events-vencidos',EventsController.pastEvents);

//Detalles de un solo evento
router.get('/events/:id',EventsController.eventDetails);

//Actualizar los datos de un evento
router.put('/events/:id',EventsController.updateEvent);
//Eliminar un evento 
router.delete('/events/:id',EventsController.deleteEvent);

export default router;