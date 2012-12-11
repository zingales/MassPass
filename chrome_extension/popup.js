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

  var vals = storeRequirements(domain);
	var genPass = generatePass(password.value, domain, username.value, vals);
	return false;
}

var loadRequirements = function(domainstr) {
  var vals = JSON.parse(localStorage.getItem(domainstr));
  if (vals === null || vals === undefined){
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
}

var storeRequirements = function(domain) {
  var vals = new Array();
  vals[0] = document.getElementsByName('num')[0].checked;
  vals[1] = document.getElementsByName('upper')[0].checked;
  vals[2] = document.getElementsByName('lower')[0].checked;
  vals[3] = document.getElementsByName('sym')[0].checked;
  vals[4] = parseInt(document.getElementsByName('num_num')[0].value);
  vals[5] = parseInt(document.getElementsByName('upper_num')[0].value);
  vals[6] = parseInt(document.getElementsByName('lower_num')[0].value);
  vals[7] = parseInt(document.getElementsByName('sym_num')[0].value);
  vals[8] = parseInt(document.getElementsByName('max_num')[0].value);
  localStorage.setItem(domain, JSON.stringify(vals));
  return vals;
}

function copyToClipboard (text) {
  window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
}

var generatePass = function(masspass, domain, username, reqs) {
  var num = '0123456789';
  var low = 'abcdefghijklmnopqrstuvwxyz';
  var cap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var sym = '~!@#$%^&*()_';
  var b64 = cap + low + num + './';

  var charset = '';
  if (reqs[0]) {charset += num};
  if (reqs[1]) {charset += cap};
  if (reqs[2]) {charset += low};
  if (reqs[3]) {charset += sym};

  reqs = [[reqs[4], num],
         [reqs[5], cap], 
         [reqs[6], low], 
         [reqs[7], sym], 
         [reqs[8]-(reqs[4]+reqs[5]+reqs[6]+reqs[7]), charset]];

  console.log(reqs);


  var concat = masspass + "" + domain + "" + username;
	var salt = "$2a$11$b0MHMsT3ErLoTRjpjzsCie";

  var callback = function(hash) {
    var hash = hash.substr(29);
    var password = '';
    var result = [0, hash];
    for (var i = 0; i<reqs.length; i++) {
      result = convert(result[1], b64, reqs[i][1], reqs[i][0]);
      password += result[0];
    }


    var shuffled = shuffle(hash.split("").reverse().join(""), b64, password);

    var out = hash + "\n" + password + "\n" + shuffled;
    //alert(out);
    copyToClipboard(shuffled);
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
