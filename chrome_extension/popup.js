var domain;
chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
    // current_url = tab.url;       //<-- return the urla
    console.log(tab.url)
    console.log(tab.url.replace('http://',''))
    console.log(tab.url.replace('http://','').replace('https://',''))
    console.log(tab.url.replace('http://','').replace('https://','').split(/[/?#]/))
    // var urlParts = tab.url.replace('http://','').replace('https://','').split(/[/?#]/)[0].replace("www.","");
	// domain = urlParts[0];
	domain =  tab.url.replace('http://','').replace('https://','').split(/[/?#]/)[0].replace("www.","");
	console.log(tab);
	main();
});
var main = function () {
	document.forms["masspass_form"]["onsubmit"] = handleSubmit;
	var display_url = document.getElementById("display_url");
	display_url.innerHTML = domain;
}

var handleSubmit = function(event) {
	// alert("i just love penises so much.");
	console.log(event);
	var form = event.srcElement;
	var password = form["password"];
	var username = form["username"];
	console.log("password "+password.value+" username "+username.value+ " domain "+domain);
	// alert("password "+password+" username "+username);
	// console.log(form.elements);
	return false;
}