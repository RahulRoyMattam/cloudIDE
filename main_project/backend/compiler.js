var fs=require('fs');

module.exports=function(code,u_id,f_name,inp_contents,callback)
{
//COMPILATION SECTION
//to create child processes
var spawn = require('child_process').spawnSync; 
var exec= require('child_process').exec;
var ret_data="";
//opening the file
var fd=fs.openSync("programs/"+u_id+"/"+f_name+".c","w+");
fs.writeSync(fd,code);
fs.close(fd);

//input text file
var fd=fs.openSync("programs/"+u_id+"/input.txt","w+");
fs.writeSync(fd,inp_contents);
fs.close(fd);
			
//compiling
var gcc=spawn('gcc',['-o','programs/'+u_id+'/'+f_name+'.o','programs/'+u_id+'/'+f_name+'.c'],{timeout:3000});
// //Error log
if(gcc.stderr.toString()!="")
{
	ret_data=gcc.stderr.toString();
	callback(null,ret_data);
}
else
{
	//var outs=spawn("./programs/"+u_id+"/"+f_name+".o",{timeout: 3000},{input: inp});
	var outs=exec("./programs/"+u_id+"/"+f_name+".o",{timeout: 3000},function(err,stdout,stderr){
		if(stderr.toString()!="")
			ret_data=stderr.toString();
		else
		{
		if(stdout.toString()!="")
			ret_data=stdout.toString();
		else
			ret_data="Runtime Error";
		}
		callback(null,ret_data);
	});
	outs.stdin.end(inp_contents);
}
}