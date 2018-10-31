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

const admin = require('./models/admin.js')
const faculty = require('./models/faculty.js')

// required for passport
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');


/******************Connection to Database***************************/

const db = require('./db/db.js');


/******************Folder Directories***************************/

const app = express();
var role;

app.use(session({ secret: 'tengakomalaki', resave: false, saveUninitialized: false }));

// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize()); 
app.use(passport.session());

//Authentication and Session--------------------------------------------
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, cb) {
    admin.getByEmail(email, function(user) {
      if (!user) { return cb(null, false); }
    
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  admin.getById(id, function (user) {
    cb(null, user);
  });
});

function isAdmin(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getCustomerData({id: req.user.id}, function(user){
    role = user[0].user_type;
    isAdmin = user[0].is_admin;
    console.log('role:',role);
    console.log('isAdmin:',isAdmin);
    if ((role == 'faculty') && (isAdmin === true)) {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/');
}
}
function isStudent (req, res, next) {
   if (req.isAuthenticated()) {
  admin.getCustomerData({id: req.user.id}, function(user){
    role = user[0].user_type;
    console.log('role:',role);
    if (role == 'student') {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/');
}
}

function isFaculty (req, res, next) {
   if (req.isAuthenticated()) {
  admin.getCustomerData({id: req.user.id}, function(user){
    role = user[0].user_type;
    isAdmin = user[0].is_admin;
    console.log('role:',role);
    console.log('isAdmin:',isAdmin);
    if ((role == 'faculty') && (isAdmin === false)) {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/');
}
}

function isGuest (req, res, next) {
   if (req.isAuthenticated()) {
  admin.getCustomerData({id: req.user.id}, function(user){
    role = user[0].user_type;
    isAdmin = user[0].is_admin;
    console.log('role:',role);
    console.log('isAdmin:',isAdmin);
    if ((role == 'guest') && (isAdmin === false)) {
        return next();
    }
    else{
      res.send('cannot access!');
    }
  });
  }
  else{
res.redirect('/');
}
}

/*********************Home***************************/

app.get('/', function (req, res) {
  res.render('login', {
  })
})

app.get('/signup', function (req, res){
  res.render('signup', {
  })
})

app.get('/logout', function (req, res){
  res.redirect('/');
})

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
  admin.getById(req.user.id, function(user){
    role = user.user_type;
    isAdmin = user.is_admin;
    req.session.user = user;
    console.log(req.session.user);
    console.log('role:',role);
    console.log('isAdmin:',isAdmin);
    if ((role == 'faculty') && (isAdmin === false)){
        res.redirect('/faculty')
    }
    else if (role == 'student'){
        res.redirect('/student')
    }
    else if ((role == 'faculty') && (isAdmin === true)){
        res.redirect('/admin')
    }
     });
  });


// app.post('/signup', (req,res) => {
//   console.log('signup data', req.data);
//   res.render('/signup');
// });


/*********************Admin***************************/


app.get('/admin', isAdmin, function (req, res){
  res.render('admin/dashboard', {
    layout: 'admin'
  })
})


//FACULTIES-----------------------------------------------

app.get('/admin/faculty', isAdmin, function (req, res){
  admin.facultyList({}, function(facultyList){
    res.render('admin/faculty', {
      layout: 'admin',
      id: req.user.id,
      fname: req.user.fname,
      lname: req.user.lname,
      email: req.user.email,
      phone: req.user.phone,
      is_admin: req.user.is_admin,
      faculties: facultyList
    })
  })
})

app.get('/admin/faculty/:id', isAdmin, function (req, res){
  db.query("SELECT id AS user_id, employee_id AS femployee, fname AS fname, lname AS lname, email AS femail, phone AS fphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
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


app.get('/admin/add_faculty', isAdmin, function (req, res){
  res.render('admin/add_faculty', {
    layout: 'admin'
  })
})

app.post('/add_faculty', function (req, res){
  db.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number, employee_id, is_admin) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "','" + req.body.employee_id + "', '" + req.body.is_admin +"');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/faculty');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//STUDENTS-----------------------------------------------


app.get('/admin/student', isAdmin, function (req, res){
  admin.studentList({}, function(studentList){
    res.render('admin/student', {
      layout: 'admin',
      student_number: req.user.student_number,
      fname: req.user.fname,
      lname: req.user.lname,
      email: req.user.email,
      phone: req.user.phone,
      students: studentList
    })
  })
})


app.get('/admin/student/:id', isAdmin, function (req, res){
  db.query("SELECT id AS user_id, student_number AS snumber, fname AS fname, lname AS lname, email AS semail, phone AS sphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
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

app.get('/admin/add_student', isAdmin, function (req, res){
  res.render('admin/add_student', {
    layout: 'admin'
  })
})

app.post('/add_student', isAdmin, function (req, res){
  db.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/student');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//CLASSES-----------------------------------------------

app.get('/admin/classes', isAdmin, function (req, res){
  admin.classList({}, function(classList){
    res.render('admin/classes', {
      layout: 'admin',
      class_id: req.user.class_id,
      batches: req.user.batches,
      sections: req.user.sections,
      year_levels: req.user.year_levels,
      fname: req.user.fname,
      lname: req.user.lname,
      classes: classList
    })
  })
})


app.get('/admin/classes/:id', isAdmin, function (req, res){
  db.query(`
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

// app.get('/admin/classes/:id', function (req, res){
//   admin.classId({id: req.user.id}, function (classId) {
//     admin.classListById({}, function (studentList) {
//       admin.noClassList({}, function (noClassList) {
//         res.render('admin/class_details', {
//           id: req.user.id,
//           student_number: req.user.student_number,
//           batch: req.user.batches,
//           section: req.user.sections,
//           fname: req.user.fname,
//           lname: req.user.lname,
//           email: req.user.email,
//           phone: req.user.phone,
//           class_id: req.user.class_id,
//           noClass: noClassList,
//           students: studentList,
//           layout: 'admin'
//         });
//       });
//     });
//   });
// });

app.post('/admin/classes/:id/addStudent', function (req, res) {
  admin.insertStudent({
    student_id: req.body.student_id,
    class_id: req.body.class_id
  },
  function(callback) {
    res.redirect('/faculty/class/:id');
  })
})

app.get('/admin/add_class', isAdmin, function (req, res){
  db.query("SELECT id AS id, batches AS batches FROM batches;")
  .then((batches)=>{
    db.query("SELECT id AS id, year_levels AS year_levels FROM year_levels;")
    .then((year_levels)=>{
      db.query("SELECT id AS id, sections AS sections FROM sections;")
      .then((sections)=>{
        db.query("SELECT id AS id, fname AS fname, lname AS lname FROM users WHERE user_type = 'faculty';")
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
  db.query("INSERT INTO classes (batch_id, year_level_id, adviser_id, section_id) VALUES ('" + req.body.batch + "', '" + req.body.year_level + "', '" + req.body.user_id + "', '" + req.body.section + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/classes');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


/*********************Faculty***************************/

app.get('/faculty', isFaculty, function (req, res){
  res.render('faculty/dashboard', {
    layout: 'faculty'
  })
})

app.get('/faculty/classes', isFaculty, function (req, res) {
  faculty.listByFacultyID({id:req.user.id}, function(classList) {
    res.render('faculty/classes', {
      classList: classList,
      batch: req.user.batches,
      section: req.user.sections,
      year_level: req.user.year_levels,
      layout: 'faculty'
    });
  });
});

// app.get('/faculty/classes', function (req, res){
//   db.query(`
//     SELECT 
//     classes.id AS class_id,
//     batches.batches AS batches,
//     sections.sections AS sections,
//     year_levels.year_levels AS year_levels
//     FROM classes
//     INNER JOIN year_levels ON year_levels.id = year_level_id
//     INNER JOIN batches ON batches.id = batch_id
//     INNER JOIN sections ON sections.id = section_id
//     WHERE adviser_id =` + req.params.id + `;
//     `)
//   res.render('faculty/classes', {
//     layout: 'faculty'
//   })
// })

app.get('/faculty/classes/:id', isFaculty, function (req, res){
  db.query(`
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


app.get('/student', isStudent, function (req, res){
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