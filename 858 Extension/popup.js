chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
    alert(tab.url);       //<-- return the url
    console.log(tab.title);     //<-- return the title
});