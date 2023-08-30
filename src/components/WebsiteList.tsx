import React, { useState } from 'react';
import { SiteInfo } from '../types';

interface WebsiteData {
  [key: string]: SiteInfo
}

const MAX_SHOWN_ITEMS = 3;

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
    chrome.storage.local.get(null, function (data) {
      setWebsiteList(data);
    });
  };


  return(
    <div className="w-full">
      { websiteList[currentUrl] &&
        <ul className="flex justify-between px-8 py-4 my-2 bg-red-100 font-bold border">
          <div className='flex items-center overflow-hidden'>
            <img src={websiteList[currentUrl].icon} alt={`${currentUrl} active icon`} className='h-6 w-6 mr-2'/>
            <p className="overflow-hidden">{currentUrl}</p>
          </div>
          <div className='flex items-center ml-2'>{`${Math.floor(websiteList[currentUrl].time / 3600).toString().padStart(2, "0")}:${Math.floor((websiteList[currentUrl].time % 3600) / 60).toString().padStart(2, "0")}:${(websiteList[currentUrl].time % 60).toString().padStart(2, "0")}`}</div>
        </ul>
      }
      <h1>Top {Math.min(Object.keys(websiteList).length, MAX_SHOWN_ITEMS)} sites</h1>
      {Object.entries(websiteList).sort(([,a],[,b]) => b.time-a.time).slice(0, MAX_SHOWN_ITEMS).map((key) => {
        return (          
          <ul className="flex justify-between px-8 py-4 my-2 bg-red-100">
            <div className='flex items-center overflow-hidden'>
              <img src={key[1].icon} alt={`${key[0]} icon`} className='h-6 w-6 mr-2'/>
              <p >{`${key[0]}`}</p>
            </div>
            <div className='flex items-center ml-2'>{`${Math.floor(key[1].time / 3600).toString().padStart(2, "0")}:${Math.floor((key[1].time % 3600) / 60).toString().padStart(2, "0")}:${(key[1].time % 60).toString().padStart(2, "0")}`}</div>
          </ul>);
      })}
      {Object.keys(websiteList).length > MAX_SHOWN_ITEMS 
        ? <button onClick={() => {
            chrome.tabs.create({
              url: "js/newTab.html"
            });
          }}>
            Show More
          </button> 
        : <></>}
    </div>
  );
}

export default WebsitesList;