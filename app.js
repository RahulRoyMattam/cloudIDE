var express = require('express');
var path = require('path');
var fs=require('fs');

//var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('cookie-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var dirname="/Users/drtomymathew/Desktop/nodeprojects/editor/";

// view engine setup
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'public')));

//SESSIONS
//when session is destroyed, corresponding,session becomes undefined
app.use(session({
  keys: ['sanjay', 'ajith','rahul','jins','aboo']
}));

//TO ENABLE SESSION ACCESS TO ALL JADE FILES
app.use(function(req,res,next){
res.locals.session = req.session;
next(); //to pass control to next handler
});

var login  = require('./routes/login');
var signup = require('./routes/signup');
var compiler = require('./routes/compiler');
var loginbackend = require('./routes/loginbackend');
var editor = require('./routes/editor.js');
var behave_search = require('./routes/behave_search');
var seedsubmit= require('./routes/seedsubmit');


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'project'
});
connection.connect();

app.use('/',login);
app.use('/signup',signup);
app.use('/editor',editor);
app.use('/behaviour_search',behave_search);
app.use('/seedsubmit',seedsubmit);


//TEMPORARY STUFF
var u_id="sanjay";
var code="#include<stdio.h>\nint main()\n{\nprintf(\"This is a C program\");\nreturn 0;\n}";

//COMPILE HANDLER FOR SEEDING
app.post('/compileseed',function(req,res){
if(req.session.user!=undefined)
{
u_id=req.session.user;
}
var ret_data="";
var code=JSON.parse(req.body.code);
var scompiler=require("./routes/scompiler.js");
var behaveseed=require("./routes/behaveseed.js");
var comp=scompiler(code,u_id,function(err,data,time){
if(time=="inf")
{
  ret_data=data;
}
var behave=behaveseed(connection,req.session.seedtag,req.session.seedcode,time,function(err,data){
  ret_data=data;
res.send(ret_data);
});

});
});

//LOGOUT
app.post('/exit',function(req,res){
req.session=null;
console.log(req.session.user);
res.send("exit");
});

//SAVE PROGRAM
app.post('/save',function(req,res){
if(req.session.user!=undefined)
{
var u_id=req.session.user;
var fname=req.body.fname;
var code=req.body.code;
var fd=fs.openSync("programs/"+u_id+"/"+fname+".c","w+");
fs.writeSync(fd,code);
fs.close(fd);
req.session.fname=fname;
res.send("saved");
}
else
{
  res.redirect('/');
}
});

//COMPILATION REQUEST HANDLER
app.post('/compile',function(req,res){
if(req.session.user!=undefined)
{
u_id=req.session.user;
}
var ret_data=[0,''];
var code1=JSON.parse(req.body.code);
var f_name=req.body.fname;
var inp_contents=req.body.inp_contents;
var arr=JSON.parse(req.body.seeds);
var seedtag=arr[0][0];
if(seedtag!=undefined)
{
req.session.seedtag=arr[0][0];
req.session.seedcode=arr[1][0];
ret_data[0]=1;
}
var compiler=require("./routes/compiler.js");
var comp=compiler(code1,u_id,f_name,inp_contents,function(err,data){
ret_data[1]=data;
res.send(ret_data);
});
});

app.post('/session',function(req,res){
res.send(req.session.seedcode);
});


//returns all c and cpp programs in a users folder
app.post('/open',function(req,res){
  if(req.session.user!=undefined)
  {
  u_id=req.session.user;
  }
  var thepath="programs/"+u_id;
  var filenames=fs.readdirSync(thepath);
  var files=[];
  for(i=0;i<filenames.length;i++)
  {
    var ext=path.extname(filenames[i]);
    if(ext=='.c'||ext=='.cpp')
      files.push(filenames[i]);
  }
  res.send(files);
  //files contains all c and cpp files
});

//loads the contents of a given file
app.post('/load',function(req,res){
if(req.session.user!=undefined)
{
u_id=req.session.user;
}
var filename=req.body.filename;
var contents=fs.readFileSync("programs/"+u_id+"/"+filename,{encoding:'utf8'});
res.send(contents);
});

//NEW USER,LOGIN,AVAIL CHECK
app.use('/login',loginbackend);

//BEHAVIOUR SEARCH QUERY
app.post('/search',function(req,res){
var ret_data="output";
var search_val=JSON.parse(req.body.search_val);
console.log(search_val);
var sql1 = "SELECT * FROM hashtable_index WHERE value LIKE 'ide_"+search_val+"%' ORDER BY value";
var query=connection.query(sql1, function(err,results){
ret_data = JSON.stringify(results);
console.log("DATA="+ret_data);
res.send(ret_data);
});
});

//LEECH BACKEND
app.post('/behave',function(req,res){
var ret_data;
var tag=req.body.tag;
var num=req.body.num;
var behaviour=require("./routes/behaviour.js");
behave=behaviour(connection,tag,num,function(err,data){
res.send(data);
});
});

app.post('/searchtag',function(req,res){
var ret_data="output";
var search_val=req.body.search_val;
var sql1 = "SELECT * FROM ide_"+search_val+" WHERE num=1";
var query=connection.query(sql1, function(err,results){
ret_data = JSON.stringify(results);
console.log("DATA="+ret_data);
res.send(ret_data);
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000);

module.exports = app;
