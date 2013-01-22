#!/usr/bin/python

import cgi
import cgitb; cgitb.enable()
import commands


form=cgi.FieldStorage()

election=open("candidates.txt").read().strip().split("\n")
election=[x.split(":") for x in election]
offices={}
for line in election:
	offices[line[0].strip().title()]=[x.strip().title() for x in line[1].split(",")]
numguide=[str(len(offices[x])) for x in offices.keys()]

if "voted.txt" not in commands.getoutput("ls").split("\n"):
	f=open("voted.txt","w")
	f.close()
	commands.getoutput("chmod 750 voted.txt")

if form:
	voted=open("voted.txt").read().strip().split("\n")
	if form["NetID"].value not in voted:
		v=open("voted.txt","a")
		v.write(form["NetID"].value+"\n")
		v.close()
		results=open("results.txt","a")
		results.write(",".join([str(form["vote"+str(x)].value) for x in range(len(offices.keys()))])+"\n")
		results.close()
		commands.getoutput("chmod 750 results.txt")


print("Content-type: text/html\n\n")


print("""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>NYUAD Online Ballot System</title>
<link rel="stylesheet" type="text/css" href="http://i5.abudhabi.nyu.edu/~jfb325/ballot/ballot.css" />
<link rel="shortcut icon" href="http://i5.abudhabi.nyu.edu/~jfb325/ballot/favicon.ico">
<link rel="icon" type="image/gif" href="http://i5.abudhabi.nyu.edu/~jfb325/ballot/animated_favicon1.gif">
<link rel="apple-touch-icon" href="http://i5.abudhabi.nyu.edu/~jfb325/ballot/apple-touch-icon.png" />
<link rel="apple-touch-startup-image" href="http://i5.abudhabi.nyu.edu/~jfb325/ballot/startup.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width">
</head>


<body onload="setTimeout(function() {window.scrollTo(0, 1)}, 100)" >


<header>
<h3><img src="http://i5.abudhabi.nyu.edu/~jfb325/ballot/logo.png"> NYUAD ONLINE BALLOT SYSTEM </h3>
</header>

<script type="text/javascript">
var isiPad = navigator.userAgent.match(/iPad/i) != null;
var summary;
var numguide =["""+"'"+("','").join(numguide)+"'"+"""]

function verifyswipe(){
	if (isiPad){
		document.getElementById("NetID").type="hidden";
		document.getElementById("instructions").innerHTML="";
		for(i=0;i<"""+str(len(offices.keys()))+""";i++){
			for(j=0;j<numguide[i];j++){
				document.getElementById("C"+i+"."+j).disabled=false;
			}
		}
		document.getElementById("vvv").disabled=false;
		element = document.getElementById("startbutton");
		element.parentNode.removeChild(element);
		element = document.getElementById("hor");
		element.parentNode.removeChild(element);
	}
	
	else{
		document.getElementById("instructions").innerHTML="Please Try Again"+document.getElementById("NetID").value;
		document.getElementById("NetID").value="";
	}
}

function VoteU(candidate,choice,total){
	document.getElementById("vote"+candidate).value=document.getElementById("C"+candidate+"."+choice).innerHTML;
	for(i=0;i<total;i++){
		if (i!=choice){
			document.getElementById("C"+candidate+"."+i).style.border="none";
		}
		else{
			document.getElementById("C"+candidate+"."+i).style.border="5px solid red";	
		}
	}
	updateSummary();
}




function Vote(candidate,choice,total){
	if (document.getElementById("C"+candidate+"."+choice).style.border=="5px solid red"){
		document.getElementById("C"+candidate+"."+choice).style.border="none";
	}
	else{
		document.getElementById("C"+candidate+"."+choice).style.border="5px solid red";	
	}
	updateSummary();
}

function updateSummary(){
	summary=""
	for (i=0;i<"""+str(len(offices.keys()))+""";i++){
		if (document.getElementById("vote"+i).value != null){
			summary+=document.getElementById("office"+i).innerHTML+": "+document.getElementById("vote"+i).value+"<br>";
		}
	}
	document.getElementById("summary").innerHTML=summary;
}

function updateSummary2(){
	summary="";
	vote="";
	for(i=0;i<"""+str(len(offices.keys()))+""";i++){
		for(j=0;j<numguide[i];j++){
			if(document.getElementById("C"+i+"."+j).style.border=="5px solid red"){
				if (summary==""){
					summary+=document.getElementById("office"+i).innerHTML+": "+document.getElementById("C"+i+"."+j).innerHTML;
					vote+=document.getElementById("C"+i+"."+j).innerHTML;
				}
				else{
					summary+="<br>"+document.getElementById("office"+i).innerHTML+": "+document.getElementById("C"+i+"."+j).innerHTML;
					vote+="|"+document.getElementById("C"+i+"."+j).innerHTML;
				}
			}
		}
		document.getElementById("vote"+i).value=vote;
	}
	document.getElementById("summary").innerHTML=summary;
}

function start(){
	document.getElementById("startbutton").disabled=false;
}


$(document).ready(function() {
  $(document).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});


</script>


<article>
<form action="http://i5.abudhabi.nyu.edu/~jfb325/cgi-bin/ballot.py" method="POST" onkeypress="return event.keyCode != 13;">

<h1 id="instructions"> CLICK THE BOX BELOW AND TYPE YOUR NETID</h1>
<input id="NetID" type="text" name="NetID" onchange="verifyswipe()" oninput="start()"required><br>
<button id="startbutton" disabled=true> START </button>
<hr id="hor">
""")


for i in xrange(len(offices.keys())):
	print("""
	<section>
	<h1 id="office"""+str(i)+"""">"""+offices.keys()[i]+"""</h1>
	<input id="vote"""+str(i)+"""" type="hidden" name="vote"""+str(i)+"""" value="No Vote">""")
	for j in xrange(len(offices[offices.keys()[i]])):
		print("""
		<button id="C"""+str(i)+"""."""+str(j)+"""" type="button" onclick="VoteU("""+str(i)+""","""+str(j)+""","""+str(len(offices[offices.keys()[i]]))+""")" disabled=true>"""+str(offices[offices.keys()[i]][j])+"""</button>	
		""")
	print("""
	</section>
	<hr>
	""")




print("""
<h3 id="summary"></h3>
<input id="vvv"  type=submit value="VOTE" disabled=true>


</form>
</article>
</body>
</html>
""")



