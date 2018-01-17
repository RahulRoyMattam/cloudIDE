/*VARIOUS QUERIES TO BE EXPECTED
1.Compile code => done
2.New User => done
2.a. Improvements can be made to the way initials.txt is handled
3.Do something about auto code on server?
4.Load earlier program =>
4.a. Fetch code from the c file with given file name
4.b. Fetch txt file with auto code words.
5.Rahul's thing =>
6.save code => almost done
6.a. Save the code
6.b. Save the auto code thing to txt file
*/
//TEMPORARY STUFF
var user="sanjay",pass="123";
var u_id="sanjay",f_name="hello";
//incorrect c codes
//var code="#include<stdio.h>\nint main()\n{\nint i=0;\nwhile(1==1)\n{\ni++;\ni--;\n}\nprintf(\"%d\",i);\nreturn 0;\n}";
//correct c code
//var code="#include<stdio.h>\nint main()\n{\nprintf(\"This is a C program\");\nreturn 0;\n}";
var code="#include<stdio.h>\nint main()\n{\nint a,b;\nscanf(\"%d\",&a);\nscanf(\"%d\",&b);\nprintf(\"%d\\n\",a);\nprintf(\"%d\\n\",b);\nreturn 0;\n}";
//cpp code
//var code="#include<iostream>\nusing namespace std;\nint main()\n{\ncout<<\"This is a C++ program.\";\n\nreturn 0;\n}";
//auto code
var auto_code="break\nstatic";
var inp_contents="2 3";


var http=require('http');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'project'
});
connection.connect();

/*
//NEW USER
var newuser=require("./newuser.js");
var newuser1=newuser(connection,user,pass,function(err,data){
	if(err) throw err;
	console.log(data);
});
*/

//SAVE PROGRAM


//COMPILER
var ret_data;
var compiler=require("./compiler.js");
var comp=compiler(code,u_id,f_name,inp_contents,function(err,data){
	ret_data=data;
	console.log(ret_data);
});


connection.end(function(err) {
  console.log("Connection is terminated"); 
});


/*
//HTTP SERVER
var querystring = require('querystring');
var url = require('url');
var server=http.createServer(function(request,response){
var pquery = querystring.parse(url.parse(request.url).query);   
//console.log(pquery);
var callback = (pquery.callback ? pquery.callback : '');
//Data that comes here will have " appended at both ends. Remove.
console.log(pquery.data);
var returnObject = {output: ret_data};
var returnObjectString = JSON.stringify(returnObject);
response.writeHead(200,{"Content-Type":"text/plain"});
response.end(callback + '(\'' + returnObjectString + '\')');
response.end();
});
server.listen(8000);
process.on("SIGINT",function(){
	console.log("Terminated");
	server.close();
});
*/
