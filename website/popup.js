$(function() {

$(document).ready(function(){
    $('a#copy-static').zclip({
        path:'js/ZeroClipboard.swf',
        copy:"copied_this_text"
    });
	main();
});

var domain;
var username;

/*chrome.tabs.getSelected(null, function(tab) {
	// var splits =  tab.url.replace('http://','').replace('https://','').split(/[/?#]/)[0].replace("www.","").split(".");
  var url = purl(tab.url);
	// domain = splits[splits.length-2]+"."+splits[splits.length-1];
  domain = url.attr('host').replace("www.", "");
  var la = /[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{3,}|[-\w]+\.[-\w]{2})$/i
  var match = la.exec(domain);
  if (match == null) {
    alert('not a valid domain!');
  } else {
    domain = match[0];
  }
	main();
});*/

var getDomain = function (raw_url) {
	var url = purl(raw_url);
	domain = url.attr('host').replace("www.", "");
	var la = /[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{3,}|[-\w]+\.[-\w]{2})$/i
	var match = la.exec(domain);
	if (match == null) {
		alert("not a valid url!");
	} else {
		domain = match[0];
		alert(domain);
	}
}

var main = function () {
	document.forms["masspass_form"]["onsubmit"] = handleSubmit;
	document.getElementById("tabindex1").focus();
	var vals = parseXML(domain);
  if (!vals) {
    vals = loadFromLocalStorage(domain);
  }
  loadRequirements(vals);
}

$(".clickable").click(function() {
	var ele = document.getElementById("toggleText");
	var img = document.getElementById("toggle_button");
	if (ele.style.display == "block") {
		ele.style.display = "none";
		img.src = "http://www.capitolpride.org/images/symbol_triangle_black.png";
	}
	else {
		ele.style.display = "block";
		img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TriangleArrow-Right.svg/461px-TriangleArrow-Right.svg.png";
	}
});

var parseXML = function (domainstr) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","sites.xml",false);
	xmlhttp.send();
	xml = xmlhttp.responseXML;
	var site=xml.getElementsByTagName("site");
	
	var vals = new Array();
	
	for (i=0;i<site.length;i++) {
		if (site[i].getElementsByTagName("domain")[0].childNodes[0].nodeValue == domainstr) {
		
			vals[0] = ['1234567890', parseInt(site[i].getElementsByTagName("numbers")[0].childNodes[0].nodeValue)];
			vals[1] = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', parseInt(site[i].getElementsByTagName("uppercase")[0].childNodes[0].nodeValue)];
			vals[2] = ['abcdefghijklmnopqrstuvwxyz', parseInt(site[i].getElementsByTagName("lowercase")[0].childNodes[0].nodeValue)];
			vals[3] = ['~!@#$%^&*()_', parseInt(site[i].getElementsByTagName("symbols")[0].childNodes[0].nodeValue)];
			vals[4] = parseInt(site[i].getElementsByTagName("maximum")[0].childNodes[0].nodeValue);
			
			return vals;
		}
	}
	
	return false;
}

var handleSubmit = function(event) {
	var form = event.srcElement;
	var password = form["password"];
	/*if (password.value.length < 16) {
		alert("Error: Your MassPass must be at least 16 characters");
		window.close();
	}*/
	username = form["username"];
	var url = form["url"];
	var num = form["num"];
	var sym = form["sym"];
	var upper = form["upper"];
	var lower = form["lower"];

	getDomain(url);
	var vals = storeRequirements(domain);
	var genPass = generatePass(password.value, domain, username.value, vals);
	return false;
}

var loadFromLocalStorage = function(domainstr) {
  var vals = JSON.parse(localStorage.getItem(domainstr));
  if (vals === null || vals === undefined || vals.length != 5){
    vals = [['0123456789', 0], ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 0], ['abcdefghijklmnopqrstuvwxyz', 0], ['~!@#$%^&*()_', 0], 40];
  }
  return vals;
}

var loadRequirements = function(vals) {
  document.getElementsByName('num')[0].checked = vals[0][1] != -1;
  document.getElementsByName('upper')[0].checked = vals[1][1] != -1;
  document.getElementsByName('lower')[0].checked = vals[2] != -1;
  document.getElementsByName('sym')[0].checked = vals[3] != -1;

  document.getElementsByName('num_num')[0].value = vals[0][1];
  document.getElementsByName('upper_num')[0].value = vals[1][1];
  document.getElementsByName('lower_num')[0].value = vals[2][1];
  document.getElementsByName('sym_num')[0].value = vals[3][1];

  document.getElementsByName('max_num')[0].value = vals[4];
}

var storeRequirements = function(domain) {
  var vals = new Array();

  vals[0] = ['0123456789', parseInt(document.getElementsByName('num_num')[0].value)];
  vals[1] = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', parseInt(document.getElementsByName('upper_num')[0].value)];
  vals[2] = ['abcdefghijklmnopqrstuvwxyz', parseInt(document.getElementsByName('lower_num')[0].value)];
  vals[3] = ['~!@#$%^&*()_', parseInt(document.getElementsByName('sym_num')[0].value)];

  if (!document.getElementsByName('num')[0].checked) { vals[0][1] = -1 };
  if (!document.getElementsByName('upper')[0].checked) { vals[1][1] = -1 };
  if (!document.getElementsByName('lower')[0].checked) { vals[2][1] = -1 };
  if (!document.getElementsByName('sym')[0].checked) { vals[3][1] = -1 };

  vals[4] = parseInt(document.getElementsByName('max_num')[0].value);

  localStorage.setItem(domain, JSON.stringify(vals));

  return vals;
}

function copyPrompt(text) {
  window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
}

var generatePass = function(masspass, domain, username, reqs) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789' + './';
  var charset = '';

  if (reqs[0][1] != -1) {charset += reqs[0][0]};
  if (reqs[1][1] != -1) {charset += reqs[1][0]};
  if (reqs[2][1] != -1) {charset += reqs[2][0]};
  if (reqs[3][1] != -1) {charset += reqs[3][0]};
  reqs[4] = [charset, reqs[4]-(reqs[0][1]+reqs[1][1]+reqs[2][1]+reqs[3][1])];

  var callback = function(hash) {
    hash = hash.substr(29);
    var password = '';
    var result = [0, hash];
    for (var i = 0; i<reqs.length; i++) {
      result = convert(result[1], b64, reqs[i][0], reqs[i][1]);
      password += result[0];
    }
    password = shuffle(hash.split("").reverse().join(""), b64, password);

    copyPrompt(password);
  }

  var concat = masspass + "" + domain + "" + username;
	var salt = "$2a$11$b0MHMsT3ErLoTRjpjzsCie";
  bc = new bCrypt();
  bc.hashpw(concat, salt, callback, function() {});
}

var shuffle = function(hash, base, pass) {
  var shuffled = '';
  var result;
  while(pass.length > 0) {
    result = divide(hash, base, pass.length);
    shuffled += pass.charAt(result[1]);
    pass = pass.substring(0, result[1]) + pass.substr(result[1]+1);
    hash = result[0];
  }
  return shuffled;
}

var convert = function(num, base, mod, len) {
  if(typeof(len)==='undefined' || len < 0) len = 1000;
  var newBase = '';
  var result;
  while (num.length > 0 && newBase.length < len) {
    result = divide(num, base, mod.length);
    num = result[0];
    dig = result[1];
    newBase = mod.charAt(result[1]) + newBase;
  }
  return [newBase, num]
}

var divide = function(num, base, mod) {
  var rem = 0;
  var quotient = '';

  var c;
  var dig;

  for (var i = 0; i < num.length; i++) {
    c = base.indexOf(num.charAt(i));
    rem = rem*base.length + c;
    dig = rem / mod;
    rem = rem % mod; 
    quotient += base.charAt(dig);
  }

  quotient = quotient.replace(new RegExp('^'+base.charAt(0)+'*'), '');

  return [quotient, rem];
}

});