import React, { useEffect, useState } from 'react';
import { SiteInfo } from '../types';
import SiteMenuItemPopup from './SiteMenuItemPopup';

interface WebsiteData {
  [key: string]: SiteInfo
}

const MAX_SHOWN_ITEMS = 15;

const WebsitesList: React.FC = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteData>({});
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Initial Load
  useEffect(() => {
    loadData();
    chrome.runtime.connect({ name: "popup" });
    window.addEventListener("focus", loadData);
    return () => {
      window.removeEventListener("focus", loadData);
    };
  },[])

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
    console.log("LOADING POPUP")
    chrome.storage.local.get("currentData", function (data) {
      if (data.currentData) {
        setWebsiteList(data.currentData);
      } else {
        setWebsiteList({});
      }
    });
  };

  return(
    <div className="flex w-full h-full flex-col bg-inherit items-center px-4">
      { websiteList[currentUrl] &&
        <ul className="w-full bg-white rounded-lg border-2 border-zinc-200 mt-4">
          <SiteMenuItemPopup icon={websiteList[currentUrl].icon} url={currentUrl} time={websiteList[currentUrl].time} focus/>
        </ul>
        
      }
      <ul className="w-full overflow-y-scroll bg-white rounded-lg border-2 border-zinc-200 my-4">
        {Object.keys(websiteList).length == 0
          ? <div className='flex justify-center items-center font-bold py-6'>
              <p>No websites visited yet!</p>
            </div> 
          : Object.entries(websiteList).sort(([,a],[,b]) => b.time-a.time).slice(0, MAX_SHOWN_ITEMS).map((key) => {
              return (<SiteMenuItemPopup icon={key[1].icon} url={key[0]} time={key[1].time}/>)
            })
        }
        {Object.keys(websiteList).length > MAX_SHOWN_ITEMS &&
          <button 
            onClick={() => {
              chrome.tabs.create({
                url: "dashboard.html"
              }); 
            }}
            className='px-2 py-1 w-full text-accent hover:underline hover:bg-[#f7f9f9]'
          >
            Show More
          </button> 
        }
      </ul>
    </div>
  );
}

export default WebsitesList;