var current_url;
chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
    current_url = tab.url;       //<-- return the url
	console.log(tab);
	main();
});
var main = function () {
	document.forms["masspass_form"]["onsubmit"] = handleSubmit;
	var display_url = document.getElementById("display_url");
	display_url.innerHTML = current_url;
}

var handleSubmit = function() {
	alert("i just love penises so much.");
	return false;
}