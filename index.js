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

// required for passport
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');


/******************Connection to Database***************************/

// const client = new Client ({
//       database: 'thesisDatabase',
//       user: 'postgres',
//       password: 'password',
//       host: 'localhost',
//       port: 5432
// });

const client = new Client ({
      database: 'd6amem65u2nj52',
      user: 'ubjxmkydixswob',
      password: 'd4837618406d735fe145adea74b7769e15771d4ff7bca0beba31901eb4315faa',
      host: 'ec2-50-17-225-140.compute-1.amazonaws.com',
      port: 5432,
      ssl: true
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


// passport.use(new Strategy({
//     usernameField: 'email',
//     passwordField: 'password'
//   },
//   function(email, password, cb) {
//     User.getByEmail(email, function(user) {
//       if (!user) { return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));

// passport.serializeUser(function(user, cb) {
//   console.log('serializeUser', user)
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//   User.getById(id, function (user) {
//     console.log('deserializeUser', user)
//     cb(null, user);
//   });
// });


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


app.get('/admin', function (req, res){
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

app.get('/admin/student/:id', function (req, res){
  client.query("SELECT id AS user_id, employee_id AS femployee, fname AS fname, lname AS lname, email AS femail, phone AS fphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
  .then((faculty_details)=>{
    res.render('admin/faculty_details', {
      layout: 'admin',
      number: student_details.rows[0].femployee,
      fname: student_details.rows[0].fname,
      lname: student_details.rows[0].lname,
      email: student_details.rows[0].femail,
      phone: student_details.rows[0].fphone,
      user_type: student_details.rows[0].user_type,
      id: student_details.rows[0].user_id
    })
  })
})


app.get('/admin/add_faculty', function (req, res){
  res.render('admin/add_faculty', {
    layout: 'admin'
  })
})

app.post('/add_faculty', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number, employee_id, is_admin) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "','" + req.body.employee_id + "', '" + req.body.is_admin +"');")
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
      students: students.rows,
    })
  })
})


app.get('/admin/student/:id', function (req, res){
  client.query("SELECT id AS user_id, student_number AS snumber, fname AS fname, lname AS lname, email AS semail, phone AS sphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
  .then((student_details)=>{
    res.render('admin/student_details', {
      layout: 'admin',
      number: student_details.rows[0].snumber,
      fname: student_details.rows[0].fname,
      lname: student_details.rows[0].lname,
      email: student_details.rows[0].semail,
      phone: student_details.rows[0].sphone,
      user_type: student_details.rows[0].user_type,
      id: student_details.rows[0].user_id
    })
  })
})

app.get('/admin/add_student', function (req, res){
  res.render('admin/add_student', {
    layout: 'admin'
  })
})

app.post('/add_student', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "');")
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
  client.query(`
    SELECT classes.id AS class_id,
      batches AS batches,
      sections AS sections,
      year_levels AS year_levels,
      fname AS fname,
      lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id;
    `)
    .then((classes)=>{
    res.render('admin/classes', {
      layout: 'admin',
      classes: classes.rows
    })
  })
})

app.get('/admin/classes/:id', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches.batches AS batch,
      sections.sections AS section,
      users.id AS adviser_id,
      users.fname AS fname,
      users.lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id
    WHERE classes.id =` + req.params.id + `;
    `)
  .then((class_details)=>{
    res.render('admin/class_details', {
      layout: 'admin',
      batch: class_details.rows[0].batch,
      section: class_details.rows[0].section,
      fname: class_details.rows[0].fname,
      lname: class_details.rows[0].lname
    })
  })
})

app.post('/admin/classes/:id', function (req, res){
  client.query(``)
  .then((results)=>{
    console.log('results?', results);
    res.redirect('admin/class_details');
  })
  .catch((err)=>{
    console.log('error',err);
  })
})


app.get('/admin/add_class', function (req, res){
  client.query("SELECT id AS id, batches AS batches FROM batches;")
  .then((batches)=>{
    client.query("SELECT id AS id, year_levels AS year_levels FROM year_levels;")
    .then((year_levels)=>{
      client.query("SELECT id AS id, sections AS sections FROM sections;")
      .then((sections)=>{
        client.query("SELECT id AS id, fname AS fname, lname AS lname FROM users WHERE user_type = 'faculty';")
        .then((faculties)=>{
          res.render('admin/add_class', {
            layout: 'admin',
            faculties: faculties.rows,
            batches:batches.rows,
            year_levels: year_levels.rows,
            sections: sections.rows
          })
        })
      })
    })
  })
})

app.post('/add_class', function (req, res){
  client.query("INSERT INTO classes (batch_id, year_level_id, adviser_id, section_id) VALUES ('" + req.body.batch + "', '" + req.body.year_level + "', '" + req.body.user_id + "', '" + req.body.section + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/classes');
  })
  .catch((err)=>{
    console.log('error', err);
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

app.get('/faculty/classes/:id', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches.batches AS batch,
      sections.sections AS section,
      users.id AS adviser_id,
      users.fname AS fname,
      users.lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id
    WHERE classes.id =` + req.params.id + `;
    `)
  .then((class_details)=>{
    res.render('faculty/faculty_details', {
      layout: 'faculty',
      batch: class_details.rows[0].batch,
      section: class_details.rows[0].section,
      fname: class_details.rows[0].fname,
      lname: class_details.rows[0].lname
    })
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