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

const client = new Client ({
      database: 'thesisDatabase',
      user: 'postgres',
      password: 'password',
      host: 'localhost',
      port: 5432
});

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

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/*********************Home***************************/

app.get('/', function (req, res) {
  res.render('login', {
  })
})

app.get('/signup', function (req, res){
  res.render('signup', {
  })
})

// app.post('/login', (req,res) => {
//   console.log('login data', req.data);
//   res.render('/login');
// });


// app.post('/signup', (req,res) => {
//   console.log('signup data', req.data);
//   res.render('/signup');
// });


/*********************Admin***************************/


app.get('/admin/dashboard', function (req, res){
  res.render('admin/dashboard', {
    layout: 'admin'
  })
})


//FACULTIES-----------------------------------------------

app.get('/admin/faculty', function (req, res){
  client.query("SELECT employee_id AS employee_id, fname AS fname, lname AS lname, email AS femail, phone AS fphone, is_admin AS is_admin FROM users WHERE user_type = 'faculty';")
  .then((faculties)=>{
    res.render('admin/faculty', {
      layout: 'admin',
      faculties: faculties.rows
    })
  })
})

app.get('/admin/add_faculty', function (req, res){
  res.render('admin/add_faculty', {
    layout: 'admin'
  })
})

app.post('/add_faculty', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, is_admin, phone, student_number, employee_id) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.is_admin + "', '" + req.body.phone + "', '" + req.body.student_number + "','" + req.body.employee_id + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/faculty');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//STUDENTS-----------------------------------------------

app.get('/admin/student', function (req, res){
  client.query("SELECT student_number AS snumber, fname AS fname, lname AS lname, email AS semail, phone AS sphone FROM users WHERE user_type = 'student';")
  .then((students)=>{
    res.render('admin/student', {
      layout: 'admin',
      students: students.rows
    })
  })
})

app.get('/admin/add_student', function (req, res){
  res.render('admin/add_student', {
    layout: 'admin'
  })
})

app.post('/add_student', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, is_admin, phone, student_number) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.is_admin + "', '" + req.body.phone + "', '" + req.body.student_number + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/student');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//CLASSES-----------------------------------------------

app.get('/admin/classes', function (req, res){
  res.render('admin/classes', {
    layout: 'admin'
  })
})

app.get('/admin/add_class', function (req, res){
  client.query("SELECT id AS id, fname AS fname, lname AS lname FROM users WHERE user_type = 'faculty' AND user_type = 'admin';")
  .then((faculties)=>{
    res.render('admin/add_class', {
      layout: 'admin',
      faculties: faculties.rows
    })
  })
})



/*********************Faculty***************************/

app.get('/faculty/dashboard', function (req, res){
  res.render('faculty/dashboard', {
    layout: 'faculty'
  })
})

app.get('/faculty/classes', function (req, res){
  res.render('faculty/classes', {
    layout: 'faculty'
  })
})


/*********************Student***************************/


app.get('/student/home', function (req, res){
  res.render('student/home', {
    layout: 'student'
  })
})




/*********************Server***************************/

app.listen(app.get('port'), function () {
  console.log('Server started at port 8080');
});

// app.listen(3000, function () {
//   console.log('Server started at port 3000');
// });