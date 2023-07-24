// Function to update the time spent on each website every second
function updateWebsiteTimes() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.startsWith("http")) {
      const url: string = new URL(currentTab.url).hostname;      
      chrome.storage.local.get(url, function (result) {
        const timeSpent = result[url] || 0;
        chrome.storage.local.set({ [url]: timeSpent + 1 });
      });
    }
  });
}

// Start the time tracking when the extension is installed or updated
chrome.runtime.onStartup.addListener(function () {
  console.log("START");
  setInterval(updateWebsiteTimes, 1000);
});

export {}