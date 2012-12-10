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

