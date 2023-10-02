import { CURRENT_DATA, RESET_TIME, USAGE_LIMIT } from "../constants";
import { SiteInfo } from "../types";

// Constants
const PREFIX = "www.";

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
      chrome.storage.local.get([CURRENT_DATA], (result) => {
        let websiteDataList: { [url: string]: SiteInfo } = {};
        if (result != null && result.currentData != null) {
          websiteDataList = result.currentData;
        }

        let siteInfo: SiteInfo = websiteDataList[url];
        if (siteInfo == null) {
          siteInfo = {
            icon: "../document.svg",
            time: 0,
          }
        }

        // Overwrite if possible
        if (siteInfo.icon == "../document.svg") {
          siteInfo.icon = (currentTab.favIconUrl != null) ? currentTab.favIconUrl : "../document.svg";
        }

        // Check for usage Limit
        chrome.storage.local.get(USAGE_LIMIT, (result) => {
          if (result[USAGE_LIMIT][url] && result[USAGE_LIMIT][url].time <= siteInfo.time) {
            console.log("OVERTIME")
            // Block webpage here
          } else {
            siteInfo.time += 1;
          }
          websiteDataList[url] = siteInfo;
          chrome.storage.local.set({ [CURRENT_DATA]: websiteDataList }, function() {
            if (isPopupOpen) {
              chrome.runtime.sendMessage({ url: url, data: siteInfo });
            }
          });
        })
      });
    }
  });
}

// Function resets when date rolls over. 
// Use actual date object to avoid cases when the week/month roll over.
// Resets at midnight the following day.
// Reset Data at the same time the time is reset as events are linked
function setResetTime() {
  let resetTime = new Date();
  resetTime.setHours(0, 0, 0, 0);
  resetTime.setDate(resetTime.getDate() + 1);
  chrome.storage.local.remove([CURRENT_DATA]);
  chrome.storage.local.set({ [RESET_TIME]: resetTime.toJSON() });
}

function resetDataOnNewDay() {
  chrome.storage.local.get([RESET_TIME], (result) => {
    if (result == null || result[RESET_TIME] == null) {
      setResetTime();
    } else {
      const storedJSONDate = result[RESET_TIME];
      const resetTime = new Date(storedJSONDate);
      let currentTime = new Date();
      if (currentTime >= resetTime) {
        setResetTime()
      }
    }
  });
}

// Start the time tracking when browser is active
chrome.runtime.onStartup.addListener( () => {
  // Initialise a reset time if it doesnt exist
  chrome.storage.local.get([RESET_TIME], (result) => {
    if (result == null || result[RESET_TIME] == null) {
      setResetTime();
    }
  });
  setInterval(updateWebsiteTimes, 1000);
});
setInterval(updateWebsiteTimes, 1000);
export { };

