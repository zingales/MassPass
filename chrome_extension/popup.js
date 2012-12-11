$(document).ready(function(){
    $('a#copy-static').zclip({
        path:'js/ZeroClipboard.swf',
        copy:"copied_this_text"
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
  var vals = JSON.parse(localStorage.getItem(domainstr));
  if (vals === null || vals === undefined){
    console.log("no stored password requirements");
  //                 num, upper, lower, symol, nunNum, uppnum, lownum, symnum)
    vals = new Array(true, true, false, true, 0      ,      0,   0   , 0, 20);
  }
  document.getElementsByName('num')[0].checked = vals[0];
  document.getElementsByName('upper')[0].checked = vals[1];
  document.getElementsByName('lower')[0].checked = vals[2];
  document.getElementsByName('sym')[0].checked = vals[3];
  document.getElementsByName('num_num')[0].value = vals[4];
  document.getElementsByName('upper_num')[0].value = vals[5];
  document.getElementsByName('lower_num')[0].value = vals[6];
  document.getElementsByName('sym_num')[0].value = vals[7];
  document.getElementsByName('max_num')[0].value = vals[8];
  // document.getElementsByName('min')[0] = vals[4];
  // document.getElementsByName('max')[0] = vals[5];
}

var storeRequirements = function(domain) {
  var vals = new Array();
  vals[0] = document.getElementsByName('num')[0].checked;
  vals[1] = document.getElementsByName('upper')[0].checked;
  vals[2] = document.getElementsByName('lower')[0].checked;
  vals[3] = document.getElementsByName('sym')[0].checked;
  vals[4] = document.getElementsByName('num_num')[0].value;
  vals[5] = document.getElementsByName('upper_num')[0].value;
  vals[6] = document.getElementsByName('lower_num')[0].value;
  vals[7] = document.getElementsByName('sym_num')[0].value;
  vals[8] = document.getElementsByName('max_num')[0].value;
  localStorage.setItem(domain, JSON.stringify(vals));
}


var generatePass = function(masspass, domain, username) {
  var dec = '0123456789';
  var low = 'abcdefghijklmnopqrstuvwxyz';
  var cap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var symbol = '~!@#$%^&*()_'
  var hex = '0123456789abcdef';
  var b64 = cap + low + dec + './'
  var fbPass = cap + low + dec + symbol
  var req = [[2, symbol], [2, dec], [2, low], [2, cap], [12, fbPass]];

  var concat = masspass + "" + domain + "" + username;
	var salt = "$2a$12$b0MHMsT3ErLoTRjpjzsCie";

  var callback = function(newHash) {
    var hashPart = newHash.substr(29);
    var hashHex = convert(hashPart, b64, hex)[0];
    var hashFB = convert(hashPart, b64, fbPass)[0];

    var comboHash = '';
    var result = [0, hashPart];
    for (var i = 0; i<req.length; i++) {
      result = convert(result[1], b64, req[i][1], req[i][0]);
      comboHash += result[0];
    }

    var shuffleHash = shuffle(hashPart, b64, comboHash);

    var out = newHash + "\n" + hashPart + "\n" + hashPart.length + "\n" + hashHex + "\n" + hashFB + "\n" + comboHash + "\n" + shuffleHash;
    console.log(out);
    //$("#pass").value(hashFB); 
    alert(out);
  }

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
  if(typeof(len)==='undefined') len = 1000;
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

