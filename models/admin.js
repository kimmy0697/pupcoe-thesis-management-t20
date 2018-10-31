const db = require('../db/db.js');

var actions = {
    getByEmail: (email,callback) => {
    const query =  `
          select * from users where email = '${email}'
      `;
      db.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
    getCustomerData: (id,callback) => {
      const query =  `
          select * from users where id = '${id.id}'
      `;
      db.query(query,(req,result)=>{
        callback(result.rows);
      });
    },
    getById: (id,callback) => {
      const query =  `
          SELECT * FROM users WHERE id = '${id}'
      `;
      db.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
    facultyList: (filter,callback) => {
      const query =  `
        SELECT *
        FROM users
        WHERE user_type = 'faculty'
        `;
      db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
      });
    },
    studentList: (filter,callback) => {
      const query =  `
        SELECT *
        FROM users
        WHERE user_type = 'student'
        `;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
      });
    },
    classList: (filter,callback) => {
      const query =`
        SELECT 
          classes.id AS class_id,
          batches AS batches,
          sections AS sections,
          year_levels AS year_levels,
          fname AS fname,
          lname AS lname
        FROM classes
        INNER JOIN year_levels ON year_levels.id = year_level_id
        INNER JOIN batches ON batches.id = batch_id
        INNER JOIN sections ON sections.id = section_id
        INNER JOIN users ON users.id = adviser_id
        `;
        db.query(query)
        .then(res => callback(res.rows))
        .catch(e => {
          console.log(e)
          callback(e)
      });
    },
    classListById: (filter,callback) => {
      const query =`
        SELECT 
          users.id AS student_id, 
          users.student_number AS student_number, 
          users.fname AS fname, 
          users.lname AS lname, 
          classes.id AS class_id,
          batches.batches AS batches,
          sections.sections AS sections
        FROM classes 
        INNER JOIN batches ON batches.id = classes.batch_id
        INNER JOIN sections ON sections.id = classes.section_id
        INNER JOIN users ON users.id = classes.adviser_id
        WHERE classes.adviser_id = '${filter.id}' 
        AND users.user_type = 'student' 
      `;
        db.query(query)
        .then(res => callback(res.rows))
        .catch(e => {
          console.log(e)
          callback(e)
      });
    },
    noClassList: (noClassData,callback) => {
      const query =
      `SELECT *
        FROM users
        WHERE user_type = 'student' 
        AND 
          users.id NOT IN (SELECT DISTINCT student_id FROM "class_students")`;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      });
    },
    classId: (filter,callback) => {
      const query =
      `SELECT id 
        FROM classes 
        WHERE adviser_id = ${filter.id} `;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
    }
  };
module.exports = actions;