const db = require('./../db');

function getByEmail(email, callback) {
  const query = `
      SELECT *
      FROM users
      WHERE email = '${email}'
    `;
  db.query(query, (req, data) => {
    if (data && data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });
};

var User = {
  getByEmail: (email, callback) => {
    getByEmail(email, callback);
  },
  getById: (userId, callback) => {
    const query = `
      SELECT *
      FROM users
      WHERE id = '${userId}'
    `;
    db.query(query, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  }
};
module.exports = User;
