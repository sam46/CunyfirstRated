window.onload = function() {
	document.getElementById('ver').innerHTML = chrome.runtime.getManifest().version;
	document.getElementById('clk').src = chrome.extension.getURL('clk.png');
} 