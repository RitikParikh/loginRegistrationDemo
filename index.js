const express = require('express');
const expressFileupload = require('express-fileupload');
const dotenv = require("dotenv");
dotenv.config();
const app = express(); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileupload());

const {startConnection,makeDb} = require('./lib/MySql-Connection');
const connection =makeDb(startConnection());
global.connection = connection;

app.use('/public', express.static(process.cwd() + '/public'));

const {routes} = require('./src/v1/users/userRoutes');
app.use(`${process.env["API_BASE_URL_V1"]}`, routes);

app.set('port', process.env["PORT"] || 3000);

app.listen(app.get('port'), () => {
    console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
    `🌏 Express server started at http://${process.env.IP}:${app.get('port')}`);
});


