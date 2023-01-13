var express = require('express');
var router = express.Router();
var db = require('../database');

var validate = require('../validators/validator');
var schema = require('../schemas/register-user-schema');

var bcrypt = require('bcrypt');
const { array } = require('yup');
const { DATE, TIMESTAMP } = require('mysql/lib/protocol/constants/types');

/* GET users listing. */
router.get('/get', function (req, res, next) {
  db.getConnection((err, connection) => {
    if (err) throw err;
    var sql = null;
    if (req.query.name) {
      sql = 'SELECT * FROM users WHERE name = ' + db.escape(req.query.name);
    } else {
      sql = 'SELECT * FROM users';
    }
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result);
    });
    connection.release();
  });
});

/* POST new user */
router.post('/register', validate(schema), (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    var sql = 'SELECT * FROM users WHERE name = ' + db.escape(req.body.name);
    connection.query(sql, function (err, result) {
      if (err) throw err;
      if (!result.length) {
        sql = "SELECT * FROM users WHERE email = " + db.escape(req.body.email);
        connection.query(sql, async function (err, result) {
          if (err) throw err;
          if (!result.length) {
            sql = 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?)';
            var password = null;
            password = await bcrypt.hash(req.body.password, 10);
            var values = [
              req.body.name,
              req.body.email,
              password,
              Date.now(),
              Date.now(),
            ];
            connection.query(sql, [values], function (err, result) {
              if (err) throw err;
              res.send('succesfully registered new user');
            });
            connection.release();
          } else {
            res.send('Email is already linked to an account.');
          }
        });
      } else {
        res.send('Username is already in use.');
      }
    });
  });
});

module.exports = router;
