import { getUserC } from './user.services';
import Eventos from '../models/Eventos';
import boom from '@hapi/boom';

//Empezamos por la creacion de un evento nuevo
export const addEvent = async (correo,evento) => {
    try {
        const user = await getUserC(correo);
        if(!user){
            throw boom.badData('Usuario no encontrado');
        }
        let newEvent = new Eventos(evento);

        return await newEvent.save();

    } catch (error) {
        throw boom.internal(error.message);
    }
}

//Obtener la lista de eventos del usuario 
export const getEventList = async (correo) => {
    try {
        const u = await getUserC(correo);
        if (!u) {
            throw boom.notFound('Usuario no encontrado');
        }
        const eventsList = await Eventos.find({
            correo:correo,
            Activo:true
        });

        return eventsList;
    } catch (error) {
        throw boom.internal(error.message);
    }
}

//Obtener la lista d eventos proximos del usuario
export const eventsProxs = async (correo) => {
    try {
        const u = await getUserC(correo);
        if (!u) {
            throw boom.notFound('Usuario no encontrado');
        }
        const eventList = await Eventos.find({
            correo:correo,
            fechaInicio:{$gt:new Date()},
            Activo:true
        }).sort({fechaInicio:1});

        return eventList;
    } catch (error) {
        throw boom.internal(error.message);
    }
}

//Obtener la lista de eventos pasados
export const pastEvents = async (correo) => {
    try {
        const u = await getUserC(correo);
        if(!u){
            throw boom.notFound('Usuario no encontrado');
        }
        const eventList = await Eventos.find({
            correo:correo,
            fechaFin:{$lt:new Date()},
            Activo:true
        }).sort({fechaFin:-1});
        return eventList;
    } catch (error) {
        throw boom.internal(error.message);
    }
}

// Obtiene los detalles de un evento específico del usuario 
export const getEventDetails = async (correo,idEvento) => {
    try {
        const u = await getUserC(correo);
        if (!u) {
            throw boom.notFound('Usuario no encontrado');
        }

        const event = await Eventos.findOne({correo:correo,idEvento:idEvento,Activo:true});
        if (!event) {
            throw boom.notFound('Ningun evento encontrado');
        }
        return event;
    } catch (error) {
        throw boom.internal(error.message);
    }
} 

//Actualiza un evento del usuario 
export const updateEvent = async (correo,nuevoEvento,idEvento) => {
    try {
        const u = await getUserC(correo);
        if (!u) {
            throw boom.notFound('Usuario no encontrado');
        }

        let updatedEvent = await Eventos.findOneAndUpdate(
            {correo:correo,idEvento:idEvento},
            nuevoEvento,{new:true}
        );
        if(!updatedEvent){
            throw boom.notFound('Ningun evento encontrado');
        }

        return updatedEvent;
    } catch (error) {
        throw boom.internal(error.message);
    }
}

//Eliminar un evento del usuario
export const deleteEvent = async (correo,idEvento) => {
    try {
        const u = await getUserC(correo);
        if (!u) {
            throw boom.notFound('Usuario no encontrado');
        }

        const event = await Eventos.findOne({correo:correo,idEvento:idEvento});

        event.Activo = false;
        
        return await event.save();
    } catch (error) {
        throw boom.internal(error.message);
    }
}