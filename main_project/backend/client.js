$(document).ready(function(){
var change="",handle="",i,hash_handle="";
var direction=true; //true-forward false-backward
var inp_contents="";
var str2=$("#demotext").val();
var tern=new TernaryTree();
var leech_active=false;
var end_hashvalue=false;
var end_hashtag=false;

//C keywords
var keywords=['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','int','long','register','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while'];
for(i=0;i<keywords.length;i++)
    tern.add(keywords[i]);
//code change detection
$("#demotext").bind('input propertychange', function(){
    alert("hello");
//current mouse position in textarea
var endpos=$(this).get(0).selectionStart;
var str2new=$(this).val();

//checking individual word
var leng,index=-1,patt=/[^a-zA-Z0-9_]/g;
leng=str2new.length-str2.length;
if(leng>0)
{
    change=str2new.slice(endpos-leng,endpos);
    direction=true;
}
else
{
    change=str2.slice(endpos,endpos-leng);
    direction=false;
}
//cntl+z is the scourge of mankind = enne paranja cntl+z ettal work cheyyilla :P
if(direction)
{
    if(leech_active){
        for(i=0;i<change.length;i++){
            if(end_hashvalue){                  //to handle:<leech:#something:num>
                if(change[i]==">"){
                end_hashtag = true;             //complete hashtag has ended. go back to normal mode
                leech_active = false;
                alert(hash_handle);
                hash_handle="";
                }  
            }else{                              //to handle:<leech:#something>
                if(change[i]==":"){
                end_hashvalue = true;           //indicates hashtag value has ended
                temp_handle = hash_handle;
                }
                if(change[i]==">"){
                    end_hashtag = true;         //complete hashtag has ended. go back to normal mode.
                    leech_active = false;
                    hash_handle=hash_handle.slice(1,hash_handle.length+1);
                    $.ajax({
                        type: "POST",
                        url: '/behave',
                        data: "tag="+hash_handle+"&code=",
                        success: function(data) {
                            var textboxval=$("#demotext").val();
                            textboxval+=decodeURIComponent(data);
                            $("#demotext").val(textboxval);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert('error ' + textStatus + " " + errorThrown);
                        }
                    });
                    hash_handle="";
                }       
            }
            if(end_hashtag==false){
            hash_handle=hash_handle+change[i];
            }
       }
    }else{
     for(i=0;i<change.length;i++)
     {
        if(patt.test(change[i]))
        {
            //Special Character
            //checking for leech tag
            if(change[i]==":"){
                var tagval = str2new.slice(i-8,i-1);
                if(tagval == "<leech"){
                    leech_active = true;  //indicates a leech tag has started
                    end_hashvalue=false;  //related flags for syntax parsing
                    end_hashtag=false;
                }
            }

            if(tern.search(handle)=="")
                tern.add(handle);
            handle="";
        }
        else
        {
            //Alphanum
            handle=handle+change[i];
        }
     }
    }
}
else
{
    for(i=endpos;i>=0;i--)
    {    
        if(patt.test(str2new[i]))
            break;
    }
    if(str2new[endpos]==undefined)
        handle=str2new.slice(i+1,str2new.length);
    else if(patt.test(str2new[endpos]))
    {
        handle=str2new.slice(i+1,endpos);
    }
    else
    {
        handle="";
    }
}
//auto code
//$("#output").val(tern.search(handle));
$("#output").val(handle);
str2=str2new;
});

//Input button
$("#inp").change(function(){
var input_file=$(this).val();
var allowed_ext=['txt']; //all allowed extensions should be added here
if(input_file=="")
{
    alert("No File Chosen!");
}
else
{
    var ext=input_file.slice(input_file.lastIndexOf('.')+1,input_file.length);
    if($.inArray(ext,allowed_ext)==-1)
    {
        alert("Invalid Extension!");
    }
    else
    {
    var file=document.getElementById("inp").files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
        inp_contents=evt.target.result;
    }
    reader.onerror = function (evt) {
        alert("error reading file");
    }
    }
}
});


//Submit button
$("#submit").click(function(){

var str=$("#demotext").val();
var arr=behaviour(str);
var str=remove_tag(str);
alert("SEED\n\nTag: "+arr[0][0]+"\nCode: "+arr[1]);
$.ajax({
        type: "POST",
        url: '/compile',
        data: "code="+encodeURIComponent(JSON.stringify(str))+"&fname=prog1&input_file="+encodeURIComponent(JSON.stringify(inp_contents)),
        success: function(data) {
            $("#output").val(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //alert('error ' + textStatus + " " + errorThrown);
        }
    });

});
});
//<seed:#tag>
function behaviour(str)
{
var k;
var n=0;
var seed_active=false;
var tags=new Array();
var tagcodes=new Array();
var tag,tagcode;
for(var i=0;i<str.length;i++)
{
    if(str[i]=='>'&&seed_active)
    {
        tag=str.substring(k,i);
        tags.push(tag);
        n++;
        k=i+1;
        seed_active=false;
    }
    if(str[i]=='<')
    {
        //either its start of seed or end
        var check=str.substring(i+1,i+5);
        if(check=='seed')
        {
            i+=7;
            k=i;
            seed_active=true;
        }
        else if(check=='ends')
        {
            tagcode=str.substring(k,i);
            tagcodes.push(tagcode);
            i+=5;
        }
    }
}   
return [tags,tagcodes,n];
}

//0=seed 1=leech
function remove_tag(str)
{
    var k;
    for(var i=0;i<str.length;i++)
    {
        if(str[i]=='<')
        {
            var check=str.substring(i+1,i+6);
            if(check=='seed:')
            {
                k=i;
                for(var j=k+6;j<str.length;j++)
                    if(str[j]=='>')
                    {
                        var repl=str.substring(k,j+1); //make it j+2 to remove extra \n
                        str=str.replace(repl,'');
                        break;
                    }
            }
            else if(check=='ends>')
            {
                var repl=str.substring(i,i+6); //made it i+7 so as to also to remove extra \n
                str=str.replace(repl,'');
            }
            else if(check=='leech')
            {
                k=i;
                for(var j=k+6;j<str.length;j++)
                    if(str[j]=='>')
                    {
                        var repl=str.substring(k,j+1); //make it j+2 to remove extra \n
                        str=str.replace(repl,'');
                        break;
                    }
            }
        }
    }
    return str;
}