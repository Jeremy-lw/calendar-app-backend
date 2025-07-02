const { response } = require('express');
const Evento = require('../models/Evento');

//Obtener eventos
const getEvento = async( req, res = response) => {

    const eventos = await Evento.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    });
}
//Crear evento
const crearEvento = async( req, res = response) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin',
        });
    }
}

//Actualizar evento
const actualizarEvento = async( req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if(!eventoId) {
            return res.status(404).json({
                ok: false,
                msg: "No existe evento con ese id",
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar este evento',
            });        
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate ( eventoId, nuevoEvento, {new: true});
        
        res.json({
            ok: true,
            evento: eventoActualizado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin',
        })
    }
}

//Borrar evento
const eliminarEvento = async( req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId );

        if(!eventoId) {
            return res.status(404).json({
                ok: false,
                msg: "No existe evento con ese id",
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar este evento',
            });        
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        await Evento.findByIdAndDelete ( eventoId );
        
        res.json({ok: true});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin',
        })
    }
}

module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}