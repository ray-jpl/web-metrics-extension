import { SiteInfo } from "../types";
// Function to update the time spent on each website every second

function updateWebsiteTimes() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.startsWith("http")) {
      var url: string = new URL(currentTab.url).hostname;
      chrome.storage.local.get(url, function (result) {
        const siteInfo = result[url];
        console.log(siteInfo);
        let curData: SiteInfo = {
          icon: (currentTab.favIconUrl != null) ? currentTab.favIconUrl : "",
          time: (siteInfo && siteInfo.time) ? siteInfo.time + 1 : 1,
        };

        chrome.storage.local.set({ [url]: curData });
      });
    }
  });
}

// Start the time tracking when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  console.log("START");
  setInterval(updateWebsiteTimes, 1000);
});

export { };

