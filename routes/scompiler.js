var fs=require('fs');

module.exports=function(code,u_id,callback)
{
//COMPILATION SECTION
//to create child processes
var spawn = require('child_process').spawnSync; 
var exec= require('child_process').exec;
var ret_data="";
//opening the file
var fd=fs.openSync("programs/behaviour/behave.c","w+");
fs.writeSync(fd,code);
fs.close(fd);

			
//compiling
var gcc=spawn('gcc',['-o','programs/behaviour/behave.o','programs/behaviour/behave.c'],{timeout:3000});
// //Error log
if(gcc.stderr.toString()!="")
{
	ret_data=gcc.stderr.toString();
	callback(null,ret_data,"inf");
}
else
{
	var time=exec('(/usr/bin/time gcc -o programs/behaviour/behave.o programs/behaviour/behave.c) &> programs/behaviour/con.txt');
	var log=fs.readFileSync('programs/behaviour/con.txt',{encoding: 'utf8'});
	speed=Number(log.substring(9,13));
	callback(null,"Successfully Compiled",speed);
}

}