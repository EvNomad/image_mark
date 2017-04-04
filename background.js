function click(e){
	chrome.tabs.query({currentWindow:true, active:true}, function(tabs) {
		var thisTab = tabs[0];
		chrome.tabs.executeScript(thisTab.id, {file:"content.js"});	
	});
	
}

chrome.browserAction.onClicked.addListener(click);