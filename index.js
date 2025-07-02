require('dotenv').config();
const cors = require('express');
const express = require('express');
const { dbConnection } = require('./db/config');

const app = express();

//Base de datos
dbConnection();

app.use( cors() );

//directorio publico
app.use(express.static('public'));

//Lectura y parse del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );


app.listen(process.env.PORT, () => {
    console.log(`Server Running in port ${process.env.PORT}`);
});