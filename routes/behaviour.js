var fs=require('fs');

module.exports=function(connection,hashtag,num,callback)
{


//behaviour backend
var ret_data="output";
var val="ide_"+hashtag;



var sql1 = "SELECT * FROM "+val+" WHERE num=1";
var query=connection.query(sql1, function(err,results){
 table_exists = results;
 console.log(table_exists);
  if(table_exists==undefined){
  ret_data = "no_tag";//no tag created yet
  callback(null,ret_data);
  }else{
 	//leech
  sql1 = "SELECT * FROM "+val+" WHERE num="+num;
 	query=connection.query(sql1, function(err,results){
 	ret_data =results[0].code;

  callback(null,ret_data);
 	});
  	
 }
 });
//BEHAVIOUR BACKEND ENDS
}
