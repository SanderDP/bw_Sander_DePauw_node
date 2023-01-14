var express = require('express');
var router = express.Router();
var db = require('../database');

var validate = require('../validators/validator');
var createNewsPostSchema = require('../schemas/create-newspost-schema');
const updateNewsPostSchema = require('../schemas/update-newspost-schema');

/* GET news listing ordered by newest first. */
router.get('/get', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        var sql = 'SELECT * FROM news ORDER BY created_at DESC'
        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
        connection.release();
    });
});

/* GET only the second and third newspost ever */
router.get('/getSecondAndThird', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        var sql = 'SELECT * FROM news LIMIT 2 OFFSET 1'
        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
        connection.release();
    });
});

/* POST new newspost */
// This route requires a user id to be part of the url as well as a JSON file to be sent. If the JSON file is missing required fields, the route will send back an error.
router.post('/create/:user_id', validate(createNewsPostSchema), (req, res) => {
    db.getConnection(async (err, connection) => {
        if (err) throw err;
        var sql = 'INSERT INTO news (title, img_file_path, content, user_id, created_at, updated_at) VALUES (?)';
        var values = [
            req.body.title,
            req.body.img_file_path,
            req.body.content,
            req.params.user_id,
            Date.now(),
            Date.now(),
        ];
        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            res.send('succesfully created new newspost');
        });
        connection.release();
    });
});

/* PUT update newspost data*/
// This route requires an id to be part of the url as well as a JSON file to be sent. If the JSON file is missing required fields, the route will send back an error.
router.put('/edit/:id', validate(updateNewsPostSchema), (req, res) => {
    db.getConnection(async (err, connection) => {
        if (err) throw err;
        var sql = 'UPDATE news SET title = ?, img_file_path = ?, content = ?, updated_at = ? WHERE id = ' + db.escape(req.params.id);
        var values = [
            req.body.title,
            req.body.img_file_path,
            req.body.content,
            Date.now(),
        ];
        connection.query(sql, values, function (err, result) {
            if (err) throw err;
            res.send('succesfully updated newspost');
        });
        connection.release();
    });
});

/* DELETE user by name */
// This route requires an id to be part of the url.
router.delete('/delete/:id', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        var sql = 'DELETE FROM news WHERE id = ' + db.escape(req.params.id);
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send('newspost succefully deleted');
            } else {
                res.send('no post with this id in database');
            }
        });
        connection.release();
    });
});

module.exports = router;