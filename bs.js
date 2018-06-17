chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    if (tab.url.toLowerCase().includes('cunyfirst')) 
        chrome.pageAction.show(tab.id);
});