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
var u_id=0,f_name="hello";
//incorrect c codes
//var code="#include<stdio.h>\nint main()\n{\nint i=0;\nwhile(1==1)\n{\ni++;\ni--;\n}\nprintf(\"%d\",i);\nreturn 0;\n}";
//correct c code
var code="#include<stdio.h>\nint main()\n{\nprintf(\"This is a C program\");\nreturn 0;\n}";
//cpp code
//var code="#include<iostream>\nusing namespace std;\nint main()\n{\ncout<<\"This is a C++ program.\";\n\nreturn 0;\n}";
//auto code
var auto_code="break\nstatic";


var http=require('http');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'jam_ide'
});
connection.connect();


//behaviour backend
var ret_data="output";
var val="ide_san";
var cod="kjnkjnhghvhgv";
var speed = 1;

var sql1 = "SELECT * FROM "+val+" WHERE num=1";
var query=connection.query(sql1, function(err,results){
 table_exists = results;
 console.log(table_exists);
  if(table_exists==undefined){
 //seed new table
 if(cod==""){
  ret_data = "no tag created yet";
 }else{
 sql1 = "CREATE TABLE "+val+" (num INT NOT NULL AUTO_INCREMENT,code VARCHAR(1000),speed FLOAT(20),PRIMARY KEY(num))";
 query=connection.query(sql1, function(err,results){
 sql1 = "INSERT INTO "+val+" (code,speed) VALUES ('"+cod+"',"+speed+")";
                query=connection.query(sql1, function(err,results) {
                   ret_data = "table created";
                });

 });
 }
 
 }else{
 	//leech
 	if(cod==""){
    sql1 = "SELECT * FROM "+val+" WHERE num=1";
 	query=connection.query(sql1, function(err,results){
 	ret_data = results[0].code;
 	});
  	}else{
 	//seed existing table.
 	speed=2;
    sql1 = "INSERT INTO "+val+" (code,speed) VALUES ('"+cod+"',"+speed+")";
     query = connection.query(sql1, function(err,results){
      ret_data = "new entry added";
 	    //sort table
 	    sql1 = "SELECT * FROM "+val+" ORDER BY speed";
 	    query=connection.query(sql1, function(err,results){
        sql1 = "DELETE FROM "+val;
        var all_elements = results;
        console.log(all_elements.length);
        var i = 0;
        query=connection.query(sql1, function(err,results){
              //reseting autoincrement
              sql1 = "ALTER TABLE "+val+" AUTO_INCREMENT = 1";
              query=connection.query(sql1, function(err,results){
                
                for(var i=0;i<all_elements.length;i++){
                sql1 = "INSERT INTO "+val+" (code,speed) VALUES ('"+all_elements[i].code+"',"+all_elements[i].speed+")";
                query=connection.query(sql1, function(err,results) {
                  
                });
              }
            });
          });
        });
     });
    
  	}
 }
 });
//BEHAVIOUR BACKEND ENDS


/*
//NEW USER
var newuser=require("./newuser.js");
var newuser1=newuser(connection,user,pass,function(err,data){
	if(err) throw err;
	console.log(data);
});
*/

//SAVE PROGRAM

/*
//COMPILER
var ret_data;
var compiler=require("./compiler.js");
var comp=compiler(code,u_id,f_name,function(err,data){
	ret_data=data;
});
*/




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


