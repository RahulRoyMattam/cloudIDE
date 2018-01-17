var fs=require('fs');

module.exports=function(connection,seedtag,seedcode,speed,callback)
{
var ret_data="output";
var val="ide_"+seedtag;
var cod=seedcode;
if(speed=="inf"){
  callback(null,"error");
}else{
 
var sql1 = "SELECT * FROM "+val+" WHERE num=1";
console.log("here"+val+" "+cod);
var query=connection.query(sql1, function(err,results){
 table_exists = results;
 console.log(table_exists);


  if(table_exists==undefined){

  	//new seed tag
  	sql1 = "CREATE TABLE "+val+" (num INT NOT NULL AUTO_INCREMENT,code VARCHAR(1000),speed FLOAT(20),PRIMARY KEY(num))";
 query=connection.query(sql1, function(err,results){
 sql1 = "INSERT INTO "+val+" (code,speed) VALUES ('"+cod+"',"+speed+")";
                query=connection.query(sql1, function(err,results) {
                   ret_data = "table created";
                   //add hashtag to search table
                   sql1="INSERT INTO hashtable_index (value) VALUES ('"+val+"')";
                   query=connection.query(sql1, function(err,results){
                      callback(null,ret_data);
                   });
                });

 });

  }else{

  	//already existing seedtag
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
                console.log("hello1");
                query=connection.query(sql1, function(err,results) {
                  console.log(results);
                  callback(null,ret_data);
                });
              }
            });
          });
        });
     });
  }
  
});

}
}