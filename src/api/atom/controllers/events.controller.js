import * as EventServices from '../services/events.services';
import boom from '@hapi/boom';

//creacion de un nuevo evento
export const addEvent = async (req,res,next) => {
    try {
        //const {correo} = req.body;
        const nuevoEvento = req.body;
        console.log(nuevoEvento);
        const evento = await EventServices.addEvent(nuevoEvento.correo,nuevoEvento);

        if(!evento){
            res.status(400).json('No se pudo agregar el evento');
        }

        res.status(200).json(evento);
    } catch (error) {
        throw res.status(400).json({mensaje:error.message});
    }
}

//obtener la lista de eventos del usuario
export const eventList = async (req,res,next) => {
    try {
        const {correo} = req.body;
        console.log(correo);
        
        const eventos = await EventServices.getEventList(correo);
        
        if(!eventos){
            res.status(400).json({mensaje:'No se pudieron recuperar los eventos'});
        }

        res.status(200).json(eventos);
    } catch (error) {
        next(error);
    }
}

//Obtener los eventos proximos
export const eventsProx = async (req,res,next) => {
    try {
        const {correo} = req.body;
        console.log(correo);
        const proxEvents = await EventServices.eventsProxs(correo);

        if(!proxEvents){
            res.status(400).json({mensaje:'No se encontró ningun evento'});
        }

        res.status(200).json(proxEvents);

    } catch (error) {
        next(error);
    }
}

//obtener los eventos PASADOS
export const pastEvents = async (req,res,next) => {
    try {
        const {correo} = req.body;
        console.log(correo);
        const eventosPasado = await EventServices.pastEvents(correo);
        if(!eventosPasado){
            res.status(400).json({mensaje:'No se encontró ningun evento'})
        }
        res.status(200).json(eventosPasado);
    } catch (error) {
        next(error);
    }
}

//Obtiene los detalles del evento de un usuario
export const eventDetails = async (req,res,next) => {
    try {
        const {id} = req.params;
        const {correo} = req.body;
        console.log(correo);
        console.log(id);
        const evento = await EventServices.getEventDetails(correo,id);
        if(!evento){
            res.status(400).json({mensaje:'No se encontró el evento'});
        }
        res.status(200).json(evento);
    } catch (error) {
        next(error);
    }
}

//Actualiza un evento del usuario 
export const updateEvent = async (req,res,next) => {
    try {
        const {id} = req.params;
        const {correo} = req.body;
        const nuevoEvento = req.body;

        const updatedEvent = await EventServices.updateEvent(correo,nuevoEvento,id);
        if(!updatedEvent){
            res.status(400).json({mensaje:'Error al actualizar el evento'});
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        next(error);
    }
}

//Eliminar un evento del usuario
export const deleteEvent = async (req,res,next) => {
    try {
        const {correo} = req.body;
        const {id} = req.params;

        const deletedEvent = await EventServices.deleteEvent(correo,id);

        if(!deletedEvent){
            res.status(400).json({mensaje:'Error en la eliminacion'});
        }
        res.status(200).json(deletedEvent);
    } catch (error) {
        next(error);
    }
}