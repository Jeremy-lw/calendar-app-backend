const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario-model');
const {generateJWT} = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {  
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese email',
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT
        const token = await generateJWT( usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });        
    }    
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {  
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        const validPassword = bcrypt.compareSync( password, usuario.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',
            });
        }

        //Generar JWT
        const token = await generateJWT( usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });   
    }
}

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;    

    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token,
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}