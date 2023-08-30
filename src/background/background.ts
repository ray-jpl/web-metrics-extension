import { SiteInfo } from "../types";

// Only transmit messages if popup is open
let isPopupOpen = false;
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        isPopupOpen = true;

        port.onDisconnect.addListener(() => {
            isPopupOpen = false;
        });
    }
});

var PREFIX = "www.";
// Function to update the time spent on each website every second
function updateWebsiteTimes() {
  resetDataOnNewDay();
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.startsWith("http")) {
      var url: string = new URL(currentTab.url).hostname;
      if (url.startsWith(PREFIX)) {
        url = url.slice(PREFIX.length);
      }
      chrome.storage.local.get(url, function (result) {
        const siteInfo = result[url];
        let curData: SiteInfo = {
          icon: (currentTab.favIconUrl != null) ? currentTab.favIconUrl : "../document.svg",
          time: (siteInfo && siteInfo.time) ? siteInfo.time + 1 : 1,
        };

        chrome.storage.local.set({ [url]: curData }, function() {
          if (isPopupOpen) {
            chrome.runtime.sendMessage({ url: url, data: curData });
          }
        });
      });
    }
  });
}

// Function resets when date rolls over. 
// Use actual date object to avoid cases when the week/month roll over.
let initDate = new Date();
let resetTime = initDate;
resetTime.setHours(0, 0, 0, 0);
resetTime.setDate(resetTime.getDate() + 1);
function resetDataOnNewDay() {
  let currentTime = new Date();
  if (currentTime >= resetTime) {
    chrome.storage.local.clear();
    resetTime.setDate(resetTime.getDate() + 1);
  }
}

// Start the time tracking when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  console.log("START");
  setInterval(updateWebsiteTimes, 1000);
});

export { };

