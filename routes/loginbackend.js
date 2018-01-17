var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'project'
});
connection.connect();

router.post('/ajax', function(req, res) {
  	var username=req.body.username;
  	var query=connection.query('SELECT username FROM user_db where ?',{username: username}, function(err, rows, fields) {
  	if (err) throw err;
 	if(rows.length==0)
 	{
 		res.send("Available");
 	}
 	else
 	{
 		res.send('<STRONG>'+username+'</STRONG> is already in use.');
 	}
	});
});

router.post('/store', function(req, res) {
  	//NEW USER
	var ret_data;
	var newuser=require("./newuser.js");
	var newuser1=newuser(connection,req.body.username,req.body.email,req.body.password,req.body.firstname,req.body.lastname,function(err,data){
  	if(err){
    	console.log(err);
  	}
  	console.log(data);
	});
	res.redirect("/");
});

router.post('/enter', function(req, res) {
  	//NEW USER
	var ret_data;
	var user=req.body.login;
	var password=req.body.password;
	var query=connection.query('SELECT * FROM user_db where (username='+connection.escape(user)+' OR email='+connection.escape(user)+') AND password='+connection.escape(password), function(err, rows, fields) {
  	if (err) throw err;
 	if(rows.length==1)
 	{
 		req.session.user=rows[0].username;
 		res.redirect('/editor');
 	}
 	else
 	{
 		res.send("Your Login Credentials were incorrect.");
 	}
	});
});

module.exports = router;
