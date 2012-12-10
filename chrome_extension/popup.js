var domain;
chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
	domain =  tab.url.replace('http://','').replace('https://','').split(/[/?#]/)[0].replace("www.","");
	main();
});

var main = function () {
	document.forms["masspass_form"]["onsubmit"] = handleSubmit;
	var display_url = document.getElementById("display_url");
	display_url.innerHTML = domain;
}

var handleSubmit = function(event) {
	var form = event.srcElement;
	var password = form["password"];
	var username = form["username"];
	console.log("password "+password.value+" username "+username.value+ " domain "+domain);
	alert("password "+password.value+" username "+username.value+ " domain "+domain);
	return false;
}


  var genPass = generatePass(password.value, domain, username.value);

  alert("p: " + genPass + " m: " + password.value + " d: " +  domain + " v: " +  username.value);
	// alert("password "+password+" username "+username);
	// console.log(form.elements);
	return false;
}

var generatePass = function(masspass, domain, username) {
  var callback = function(newhash) {
    alert(newhash);
  }
  var concat = masspass + "" + domain + "" + username;
	var salt = "$2a$12$b0MHMsT3ErLoTRjpjzsCie";

  bcrypt.hashpw(concat, salt, callback, function() {});
}

/*
var convert = function(num, base, mod) {
  newBase = ''
  while len(num) > 0:
    (num, dig) = divide(num, base, mod)
    newBase = mod[dig] + newBase
  return newBase
}

var divide = function(num, base, mod) {
  rem = 0
  quotient = ''
  for i in xrange(len(num)):
    c = base.index(num[i])
    rem = rem*len(base) + c
    dig = rem / len(mod)
    rem = rem % len(mod) 
    quotient += base[dig]

  while len(quotient) > 0 and quotient[0] == '0':
    quotient = quotient[1:]
  return (quotient, rem)
}
dec = '0123456789'
hex = '0123456789abcdef'
b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
fbPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_'
*/
