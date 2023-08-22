import React, { useState } from 'react';
import { SiteInfo } from '../types';

interface WebsiteData {
  [key: string]: SiteInfo
}

const WebsitesList: React.FC = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteData>({});
  chrome.storage.onChanged.addListener(function() {
    updatedData();
  })
  
  window.addEventListener('focus', function () {
    updatedData();
  });
  
  function updatedData() {
    chrome.storage.local.get(null, function (data) {
      console.log(data);
      setWebsiteList(data);
    });
  };
  return(
    <div>
      {Object.entries(websiteList).sort(([,a],[,b]) => b.time-a.time).map((key) => {
        return (          
          <ul className='flex justify-between px-8 py-4 my-2 bg-red-100'>
            <div className='flex items-center'>
              <img src={key[1].icon} alt={`${key[0]} icon`} className='h-6 w-6 mr-2'/>
              <p className='font-bold'>{`${key[0]}`}</p>
            </div>
            <div className='flex items-center'>{`${Math.floor(key[1].time / 3600).toString().padStart(2, "0")}:${Math.floor((key[1].time % 3600) / 60).toString().padStart(2, "0")}:${(key[1].time % 60).toString().padStart(2, "0")}`}</div>
          </ul>);
      })}
    </div>
  );
}

export default WebsitesList;