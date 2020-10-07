const express = require('express');
const logger = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDocs = require('swagger-jsdoc');
const { nameDb, passwdDb, dbName } = require('./config')
const mongoose = require('mongoose');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoDB = `mongodb+srv://${user}:${passwdDb}@` +
  `cluster0.rq3kf.mongodb.net/${dbName}?retryWrites=true&w=majority` || 'mongodb://localhost:27017/Peajes';


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//const mongoDB = process.env.DB || 'mongodb://localhost:27017/Peajes';
// Use VR
app.use('/api', require('./routes/index.js'));

app.get('*',function (req, res) {
  res.redirect('/api/tolls');
});


/**
 * redirect 404 errors in ExpressJS
 */

app.use(function(req, res, next){
  res.status(404);
  res.send({
    error: 'Not found. Please following this guide https://github.com/SneyderHOL/Quick_Project'
  });
});

module.exports = app;
