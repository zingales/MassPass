var current_url;
chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
    current_url = tab.url;       //<-- return the url
	console.log(tab);
	main();
});
var main = function () {
	var display_url = document.getElementById("display_url");
	display_url.innerHTML = current_url;
}