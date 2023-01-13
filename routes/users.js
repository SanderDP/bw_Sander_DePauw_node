var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET users listing. */
router.get('/get', function (req, res, next) {
  db.getConnection((err, connection) => {
    if (err) throw err;
    var sql = null;
    console.log(req.query.name);
    if (req.query.name) {
      sql = 'SELECT * FROM users WHERE name = ' + db.escape(req.query.name);
    } else {
      sql = 'SELECT * FROM users';
    }
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
});

module.exports = router;
