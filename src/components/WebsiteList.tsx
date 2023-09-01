import React, { useState } from 'react';
import { SiteInfo } from '../types';
import SiteMenuItem from './SiteMenuItem';

interface WebsiteData {
  [key: string]: SiteInfo
}

const MAX_SHOWN_ITEMS = 15;

const WebsitesList: React.FC = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteData>({});
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const port = chrome.runtime.connect({ name: "popup" });
  window.addEventListener('focus', function () {
    // Initialise data on load.
    // Called twice on load for some reason probs some React refresh thing
    loadData();
  });

  // When React refreshes the popup just adds a new listener, taking more CPU
  // Hence we need to check if listeners already exist
  if (!chrome.runtime.onMessage.hasListeners()) {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
      setWebsiteList(websiteList => ({
        ...websiteList,
        [message.url]: message.data,
      }))
      setCurrentUrl(message.url);
    });
  }

  function loadData() {
    chrome.storage.local.get("currentData", function (data) {
      if (data.currentData) {
        setWebsiteList(data.currentData);
      } else {
        setWebsiteList({});
      }
    });
  };

  return(
    <div className="flex w-full h-full flex-col bg-inherit">
      { websiteList[currentUrl] &&
        <SiteMenuItem icon={websiteList[currentUrl].icon} url={currentUrl} time={websiteList[currentUrl].time} focus/>
      }
      <div className="overflow-y-scroll">
        {Object.entries(websiteList).sort(([,a],[,b]) => b.time-a.time).slice(0, 15).map((key) => {
          return (<SiteMenuItem icon={key[1].icon} url={key[0]} time={key[1].time}/>)
        })}
        <div className='flex justify-center items-center'>
          {Object.keys(websiteList).length > MAX_SHOWN_ITEMS &&
            <button 
              onClick={() => {
                chrome.tabs.create({
                  url: "js/dashboard.html"
                }); 
              }}
              className='px-2 py-1 rounded-full hover:font-bold hover:bg-zinc-200 hover:underline'
            >
              Show More
            </button> 
          }
        </div>

      </div>



    </div>
  );
}

export default WebsitesList;