const db = require('../db/db.js');

var actions = {
  listByFacultyID: (filter,callback) => {
    const query =
      `SELECT
      batches.batches AS batches,
      sections.sections AS sections,
      year_levels.year_levels AS year_levels
      FROM classes
      INNER JOIN batches ON batches.id = classes.batch_id
      INNER JOIN sections ON sections.id = classes.section_id
      INNER JOIN year_levels ON year_levels.id = classes.year_level_id
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