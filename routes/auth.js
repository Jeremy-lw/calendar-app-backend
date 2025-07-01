//Rutas de usuarios / Auth
//host + /api/auth

const { Router } = require('express');
const router = Router();

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [
        check('name', 'Nombre es obligatorio').not().isEmpty(),
        check('email', 'Email es obligatorio').isEmail(),
        check('password', 'Password debe tener 6 caracteres').isLength({ min: 6}),
        validarCampos,
    ],
    crearUsuario );

router.post(
    '/', 
    [
        check('email', 'Email incorrecto').isEmail(),
        check('password', 'Password debe tener 6 caracteres').isLength({ min: 6 },),
        validarCampos,
    ],
    loginUsuario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;