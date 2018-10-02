/******************Constant Variables*******************************/

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const Handlebars = require('handlebars');
const MomentHandler = require('handlebars.moment');
MomentHandler.registerHelpers(Handlebars);
const NumeralHelper = require("handlebars.numeral");
NumeralHelper.registerHelpers(Handlebars);
// const PORT = process.env.PORT || 3000

/******************Connection to Database***************************/

const client = new Client {
      database: 'thesisDatabase',
      user: 'postgres',
      password: 'password',
      host: 'localhost',
      port: 5432
}

client.connect()
  .then(function () {
    console.log('Connected to database');
  })
  .catch(function (err) {
    if (err) {
      console.log('Cannot connect to database');
    };
  });

/******************Folder Directories***************************/

const app = express();

// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static1')));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/*********************Home***************************/

app.get('/', function (req, res) {
  res.render('/home', {
  });
});

// app.get('/login', function (req, res) {
//   res.render('/login', {
//   });
// });

// app.post('/login', (req,res) => {
//   console.log('login data', req.data);
//   res.render('/login');
// });

// app.get('/signup', function (req, res){
//   res.render('/signup', {
//   });
// });

// app.post('/signup', (req,res) => {
//   console.log('signup data', req.data);
//   res.render('/signup');
// });


/*********************Server***************************/

app.listen(app.get('port'), function () {
  console.log('Server started at port 8080');
});

// app.listen(3000, function () {
//   console.log('Server started at port 3000');
// });