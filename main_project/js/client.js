CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword});
      };

var editor= CodeMirror.fromTextArea(document.getElementById("demotext"), {
      mode: "text/x-c++src", //mode for c => text/x-csrc
      matchBrackets: true,
      autoCloseBrackets: true,
      highlightSelectionMatches: true,
      styleActiveLine: true,
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      extraKeys: {"Ctrl-Space": "autocomplete"}
});
var input = document.getElementById("select");
  function selectTheme() {
    var theme = input.options[input.selectedIndex].innerHTML;
    editor.setOption("theme", theme);
  }
  var choice = document.location.search &&
               decodeURIComponent(document.location.search.slice(1));
  if (choice) {
    input.value = choice;
    editor.setOption("theme", choice);
  }


$(document).ready(function(){

var direction=true;
var handle="",hash_handle="";
var inp_contents="";
var leech_active=false;
var end_hashvalue=false;
var end_hashtag=false;


$("#files").click(function(){
$.ajax({
  type: "POST",
  url: '/open',
  success: function(data) {
    var input_data = data;
    var letters="";
    var item="";
    var arrayLength = input_data.length;
    for (var i = 0; i < arrayLength; i++) 
    {
      item="<li><a href='#'>"+input_data[i]+"</a></li>";
      $("#direc").append(item);
    }
    
    },
  error: function(jqXHR, textStatus, errorThrown) {
    alert('error ' + textStatus + " " + errorThrown);
  }
});
});

$("#exit").click(function(){
$.ajax({
  type: "POST",
  url: '/exit',
  success: function(data) {
      console.log("Exited");
      window.location.replace('/');
    },
  error: function(jqXHR, textStatus, errorThrown) {
    alert('error ' + textStatus + " " + errorThrown);
  }
});
});

$("#save").click(function(){
var savedialog=document.getElementById("savedialog");
classie.add(savedialog,'dialog--open');
});

$("#yes").click(function(){
editor.save();
var fname=$("#fname").val();
var str=$("#demotext").val();
alert(fname);
$.ajax({
  type: "POST",
  url: '/save',
  data: 'code='+str+'&fname='+fname,
  success: function(data) {
    var savedialog=document.getElementById("savedialog");
    $("#savedialog dialog__content").html("<h2>Saved!</h2>");
    classie.remove(savedialog,'dialog--open');
    classie.add(savedialog,'dialog--close');
    setTimeout(function(){classie.remove(savedialog,'dialog--close');},750);
    },
  error: function(jqXHR, textStatus, errorThrown) {
    alert('error ' + textStatus + " " + errorThrown);
  }
});
});

$("#no").click(function(){
var savedialog=document.getElementById("savedialog");
classie.remove(savedialog,'dialog--open');
classie.add(savedialog,'dialog--close');
setTimeout(function(){classie.remove(savedialog,'dialog--close');},750);
});

$("#direc li a").live("click",function(){
$.ajax({
  type: "POST",
  url: '/load',
  data: "filename="+$(this).html(),
  success: function(data) {
      editor.getDoc().setValue(data);
      // var dialog=document.getElementById("somedialog");
      // classie.remove( somedialog, 'dialog--open' );
      // classie.add( somedialog, 'dialog--close' );
    },
  error: function(jqXHR, textStatus, errorThrown) {
    alert('error ' + textStatus + " " + errorThrown);
  }
});
});


    //C keywords
    var keywords=['auto','break','case','class','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','int','include','long','printf','scanf','register','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while'];
    for(i=0;i<keywords.length;i++)
      tern.add(keywords[i]);

    editor.on("change",function(editor,changeobj){
      editor.save();
      var str=document.getElementById("demotext").value;
      //current mouse position in textarea
      var patt=/[^a-zA-Z0-9_]/g;
      var startpos=changeobj.from.ch;
      if(changeobj.from.ch==changeobj.to.ch)
      {
        direction=true;
      }
      else
      {
        direction=false;
      }
      var change=changeobj.text;
      if(direction)
      {
        if(leech_active)
        {
          for(i=0;i<change.length;i++)
          {
            if(end_hashvalue){                  //to handle:<leech:#something:num>
                if(change[i]==">"){
                end_hashtag = true;             //complete hashtag has ended. go back to normal mode
                leech_active = false;
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
                    var thehandle=hash_handle;
                    //alert(hash_handle);
                    $.ajax({
                        type: "POST",
                        url: '/behave',
                        data: "tag="+hash_handle+"&num=1",
                        success: function(data) {
                          str=str.replace('<leech:#'+thehandle+'>',data);
                          editor.getDoc().setValue(str);
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
        }
        else
        {
        for(i=0;i<change.length;i++)
        {
          if(patt.test(change[i]))
          {
              //checking for leech tag
              if(change[i]==":"){
                var active_line=editor.getLine(changeobj.from.line);
                var tagval = active_line.slice(i-7,i-1);
                if(tagval == "<leech"){
                    leech_active = true;  //indicates a leech tag has started
                    end_hashvalue=false;  //related flags for syntax parsing
                    end_hashtag=false;
                }
              }
              //Special Character
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
        var active_line=editor.getLine(changeobj.from.line);
        var leng=active_line.length;
        handle="";
        for(i=startpos;i>=1;i--) //i=startpos to i=1
        {    
          if(patt.test(active_line[leng-i]))
              handle="";
          else
            handle=handle+active_line[leng-i];
        }
      }
      //document.getElementById("output").innerHTML=tern.search(handle);
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
editor.getDoc().setValue(str);
console.log(arr);
$.ajax({
        type: "POST",
        url: '/compile',
        data: "code="+encodeURIComponent(JSON.stringify(str))+"&fname=prog1&inp_contents="+inp_contents+"&seeds="+encodeURIComponent(JSON.stringify(arr)),
        success: function(data) {
          $("#output").val(data[1]);
          if(data[0]==1)
          {
            window.open('/seedsubmit','_blank');
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
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