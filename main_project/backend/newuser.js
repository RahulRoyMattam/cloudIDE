var fs=require('fs');

module.exports=function(connection,user,pass,callback)
{
//getting u_id & updating its value
var u_id=fs.readFileSync("initials.txt",{encoding: 'utf8'});
fs.writeFile("initials.txt",Number(u_id)+1,function(err){
if(err)callback(err);
});
//creating folder for files
fs.mkdir("user"+u_id,function(err){
if(err)callback(err);
});
//Inserting user details into db
var query=connection.query('INSERT INTO user_db SET ?', {username: user,password: pass,u_id: u_id});
query.on("error",function(err){
	callback(err);
}).on("end",function(){
	callback(null,"Inserted");
});

}