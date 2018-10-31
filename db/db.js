const { Client } = require('pg');

// instantiate client using your DB configurations
const client = new Client({
      database: 'd6amem65u2nj52',
      user: 'ubjxmkydixswob',
      password: 'd4837618406d735fe145adea74b7769e15771d4ff7bca0beba31901eb4315faa',
      host: 'ec2-50-17-225-140.compute-1.amazonaws.com',
      port: 5432,
      ssl: true
    });

//Local DB-----------------------------------------------

// const client = new Client ({
//       database: 'thesisDatabase',
//       user: 'postgres',
//       password: 'password',
//       host: 'localhost',
//       port: 5432
// });

// Heroku Cli : heroku pg:psql postgresql-perpendicular-52593 --app pupcoe-thesis-management-t20


client.connect().then(function () {
  console.log('Connected to database!')
}).catch(function (err) {
  if (err) {}
  console.log('Cannot connect to database!')
})


module.exports = {
  query: (text, callback) => {
    return client.query(text, callback)
  }
}

