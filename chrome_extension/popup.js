$(document).ready(function(){
    $('a#copy-static').zclip({
        path:'js/ZeroClipboard.swf',
        copy:$('p#static').text()
    });
});

var domain;
chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
  // TODO add a better domain getter.
	domain =  tab.url.replace('http://','').replace('https://','').split(/[/?#]/)[0].replace("www.","");
	main();
});

var main = function () {
	document.forms["masspass_form"]["onsubmit"] = handleSubmit;
	var display_url = document.getElementById("display_url");
	display_url.innerHTML = domain;
  loadRequirements(domain);
}

var handleSubmit = function(event) {
	var form = event.srcElement;
	var password = form["password"];
	var username = form["username"];
	var num = form["num"];
	var sym = form["sym"];
	var upper = form["upper"];
	var lower = form["lower"];
	console.log("password "+password.value+" username "+username.value+ " domain "+domain + " num " + num.checked + " sym " + sym.checked + " upper " + upper.checked + " lower " + lower.checked);
	//alert("password "+password.value+" username "+username.value+ " domain "+domain + " num " + num.checked + " sym " + sym.checked + " upper " + upper.checked + " lower " + lower.checked);
	var genPass = generatePass(password.value, domain, username.value);
  storeRequirements(domain);
	return false;
}

var loadRequirements = function(domainstr) {
  // array of password requirements for that domain
  //                   num, upper, lower, symol, min, max
  var vals = JSON.parse(localStorage.getItem(domainstr));
  if (vals === null || vals === undefined){
    console.log("no stored password requirements");
    vals = new Array(true, true, false, true, 6  , 20);
  }
  document.getElementsByName('num')[0].checked = vals[0];
  document.getElementsByName('upper')[0].checked = vals[1];
  document.getElementsByName('lower')[0].checked = vals[2];
  document.getElementsByName('sym')[0].checked = vals[3];
  // document.getElementsByName('min')[0] = vals[4];
  // document.getElementsByName('max')[0] = vals[5];
}

var storeRequirements = function(domain) {
  var vals = new Array();
  vals[0] = document.getElementsByName('num')[0].checked;
  vals[1] = document.getElementsByName('upper')[0].checked;
  vals[2] = document.getElementsByName('lower')[0].checked;
  vals[3] = document.getElementsByName('sym')[0].checked;
  localStorage.setItem(domain, JSON.stringify(vals));
}


var generatePass = function(masspass, domain, username) {
  var dec = '0123456789';
  var hex = '0123456789abcdef';
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
  var fbPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_';

  var concat = masspass + "" + domain + "" + username;
	var salt = "$2a$12$b0MHMsT3ErLoTRjpjzsCie";

  var callback = function(newHash) {
    var hashPart = newHash.substr(29);
    var hashHex = convert(hashPart, b64, hex);
    var hashFB = convert(hashPart, b64, fbPass);
    var out = newHash + "\n" + hashPart + "\n" + hashPart.length + "\n" + hashHex + "\n" + hashFB;
    console.log(out);
    alert(out);
  }

  bc = new bCrypt();
  bc.hashpw(concat, salt, callback, function() {});
}

var convert = function(num, base, mod) {
  var newBase = '';
  var result;
  while (num.length > 0) {
    result = divide(num, base, mod);
    num = result[0];
    dig = result[1];
    newBase = mod.charAt(result[1]) + newBase;
  }
  return newBase
}

var divide = function(num, base, mod) {
  var rem = 0;
  var quotient = '';

  var c;
  var dig;

  for (var i = 0; i < num.length; i++) {
    c = base.indexOf(num.charAt(i));
    rem = rem*base.length + c;
    dig = rem / mod.length;
    rem = rem % mod.length; 
    quotient += base.charAt(dig);
  }

  quotient = quotient.replace(new RegExp('^'+base.charAt(0)+'*'), '');

  return [quotient, rem];
}

