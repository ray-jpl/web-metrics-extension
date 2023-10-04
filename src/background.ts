import { CURRENT_DATA, USAGE_LIMIT } from "./constants";
import { SiteInfo, UsageLimit } from "./types";

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
        chrome.storage.local.get(USAGE_LIMIT).then((result) => {
          if (result && result[USAGE_LIMIT] && result[USAGE_LIMIT][url] && result[USAGE_LIMIT][url].time <= siteInfo.time) {
            // Block webpage here
            result[USAGE_LIMIT][url].blocked = true;
            chrome.storage.local.set({ [USAGE_LIMIT]:result[USAGE_LIMIT] }).then(() => {
              setBlockedWebsites();
              // Reload page to apply limit
              chrome.tabs.reload();
            })
          } else {
            if (result && result[USAGE_LIMIT] && result[USAGE_LIMIT][url]?.blocked && result[USAGE_LIMIT][url] >= siteInfo.time) {
              result[USAGE_LIMIT][url].blocked = false
              chrome.storage.local.set({ [USAGE_LIMIT]:result[USAGE_LIMIT] }).then(() => {
                setBlockedWebsites();
              });
            } 
            siteInfo.time += 1;
          }
          websiteDataList[url] = siteInfo;
          chrome.storage.local.set({ [CURRENT_DATA]: websiteDataList }).then(() => {
            if (isPopupOpen) {
              chrome.runtime.sendMessage({ url: url, data: siteInfo });
            }
          }) 
        }) 
      });
    }
  });
}

// Ensure the alarm is set when the extension starts
chrome.alarms.get("midnightAlarm", (alarm) => {
  if (!alarm) {
    // Find the time duration until midnight
    const currentTime = Date.now()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - currentTime
    // Create an alarm to update the storage every 24 hours at midnight
    chrome.alarms.create("midnightAlarm", {
      // When means the time the alarm will fire, so in this case at midnight
      when: Date.now() + msUntilMidnight,
      // Time between each alarm firing, in this case every 24 hours after the first midnight alarm
      periodInMinutes: 24 * 60
    })
  }
})

async function resetDataOnNewDay() {
  return new Promise<void>((resolve, reject) => {
    try {
      chrome.storage.local.remove([CURRENT_DATA], () => {
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

// Reset data at midnight
chrome.alarms.onAlarm.addListener(() => {
  resetDataOnNewDay();
  // Reset blocks
  chrome.declarativeNetRequest.getDynamicRules((oldRules) => {
    chrome.declarativeNetRequest.updateDynamicRules({ 
      removeRuleIds: oldRules.map(rule => rule.id), 
    })
  });
})

function setBlockedWebsites() {
  chrome.storage.local.get(USAGE_LIMIT, (result) => {
    if (result && result[USAGE_LIMIT]) {
      let entries: {[key:string] : UsageLimit} = result[USAGE_LIMIT];
      const rules: any[] = []
      
      Object.entries(entries).forEach(([url, usage], index) => {
        if (usage.blocked == true) {
          rules.push({
            id: index + 1,
            priority: 1,
            action: {
              type: "block"
            },
            condition: {
              urlFilter: url,
              resourceTypes: ["main_frame"]
            }
          });
        }
      });
      try {
        chrome.declarativeNetRequest.getDynamicRules((oldRules) => {
          chrome.declarativeNetRequest.updateDynamicRules({ 
            removeRuleIds: oldRules.map(rule => rule.id), 
            // Type error for addRules, but it works
            // @ts-ignore
            addRules: rules
          })
        });
        console.log("Redirect rule updated")
      } catch (error) {
        console.error("Error updating redirect rule:", error)
      }
    }
  })
}

// Start the time tracking when browser is active
chrome.runtime.onStartup.addListener(() => {
  setInterval(updateWebsiteTimes, 1000);
});
setInterval(updateWebsiteTimes, 1000);

const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 5e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

export { };

