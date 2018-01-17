$(document).ready(function(){
$.ajax({
        url: '/session',
        jsonpCallback: "callback",
        cache: false,
        timeout: 5000,
        success: function(data) {
            $("#demotext").val(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });

$("#submit").click(function(){
var str=$("#demotext").val();
$.ajax({
        type: "POST",
        url: '/compile',
        data: "code="+encodeURIComponent(JSON.stringify(str))+"&fname=prog1&input_file="+encodeURIComponent(JSON.stringify(inp_contents))+"&seedtag="+undefined,
        success: function(data) {
            $("#output").val(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //alert('error ' + textStatus + " " + errorThrown);
        }
    });

});

});