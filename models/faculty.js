const db = require('../db/db.js');

var actions = {
  listByFacultyID: (filter,callback) => {
    const query =
      `SELECT *
      FROM classes
      WHERE classes.adviser_id = ${filter.id}
      `;
      db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
    });
  }
}
module.exports = actions