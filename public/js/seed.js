$(document).ready(function(){
var session_data="";
$.ajax({
        type:"POST",
        url: '/session',
        success: function(data) {
            session_data=data;
            $("#demotext").val("//Add template here\n"+data+"\n//Add template here");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });

$("#submit").click(function(){
var str=$("#demotext").val();
var check=0;
check=str.search(session_data);
if(check!=-1)
{
$.ajax({
        type: "POST",
        url: '/compileseed',
        data: "code="+encodeURIComponent(JSON.stringify(str)),
        success: function(data) {
            $("#output").val(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //alert('error ' + textStatus + " " + errorThrown);
        }
    });
}
else
{
    alert("Seed code is different from the one you have entered!!");
}
});

});