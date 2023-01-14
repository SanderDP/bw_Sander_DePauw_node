var express = require('express');
var router = express.Router();
var db = require('../database');

var validate = require('../validators/validator');
var registerUserSchema = require('../schemas/register-user-schema');
var updateUserSchema = require('../schemas/update-user-schema');
var changeAdminStatusSchema = require('../schemas/change-admin-status-schema');

var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/get', function (req, res, next) {
  db.getConnection((err, connection) => {
    if (err) throw err;
    var sql = null;
    if (req.query.name) {
      // if the url sends "?name=..." this function wll send back the user data from this particular user
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

/* PUT update user data*/
// This route expects both an id in the query as well as a JSON file to be sent. If the JSON file is missing required fields, the route will send back an error.
router.put('/edit/:id', validate(updateUserSchema), (req, res) => {
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
            sql = 'UPDATE users SET name = ?, email = ?, birthday = ?, avatar = ?, about_me = ?, updated_at = ? WHERE id = ' + db.escape(req.params.id);
            var values = [
              req.body.name,
              req.body.email,
              req.body.birthday,
              req.body.avatar,
              req.body.about_me,
              Date.now()
            ];
            connection.query(sql, values, function (err, result) {
              if (err) throw err;
              res.send('succesfully updated user info');
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

/* PUT make user admin */
// This route expects an id in the query as well as a JSON file to be sent. If the JSON file is missing a is_admin parameter, the route will send back an error.
router.put('/changeAdminStatus/:id', validate(changeAdminStatusSchema), (req, res) => {
  db.getConnection( (err, connection) => {
    if (err) throw err;
    var sql = 'UPDATE users SET is_admin = ' + db.escape(req.body.is_admin) +  ' WHERE id = ' + db.escape(req.params.id);
    connection.query(sql, function(err, result){
      if (err) throw err;
      res.send('succesfully changed admin status');
    })
    connection.release();
  })
})

/* POST new user */
// This route requires a JSON file to be sent. If the JSON file is missing required fields, the route will send back an error.
router.post('/register', validate(registerUserSchema), (req, res) => {
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

/* DELETE user by name */
// This route requires the url to have "?name=..." in it.
router.delete('/delete', function (req, res, next) {
  db.getConnection((err, connection) => {
    if (err) throw err;
    var sql = 'DELETE FROM users WHERE name = ' + db.escape(req.query.name);
    connection.query(sql, function (err, result) {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.send('user succefully deleted');
      } else {
        res.send('no user with this username in database');
      }
    });
    connection.release();
  });
});

module.exports = router;
