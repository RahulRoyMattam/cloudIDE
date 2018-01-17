var fs=require('fs');

module.exports=function(connection,username,email,password,firstname,lastname,callback)
{
var dirname="/Users/drtomymathew/desktop/nodeprojects/editor";
//creating folder for files
if (!fs.existsSync(dirname+"/programs/"+username)){
	console.log("hello");
    fs.mkdirSync(dirname+"/programs/"+username);
}
else
{
	console.log("error");
	callback("error",null);
}

//Inserting user details into db
var query=connection.query('INSERT INTO user_db SET ?', {username: username,email: email,password: password,firstname: firstname,lastname: lastname});
query.on("error",function(err){
	callback(err);
}).on("end",function(){
	callback(null,"Inserted");
});

}