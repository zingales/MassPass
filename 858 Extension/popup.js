chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
    console.log(tab.url);       //<-- return the url
    console.log(tab.title);     //<-- return the title
});