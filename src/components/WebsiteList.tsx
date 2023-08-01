import React, { useState } from 'react';

interface WebsiteData {
  [key: string]: any
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
      setWebsiteList(data);
    });
  };
  return(
    <div>
      {/* {
        Object.entries(websiteList).sort(([,a],[,b]) => b-a).map((key) => (
          <ul className='flex justify-between px-8 my-2 bg-red-100'>
            <div>{`${key[0]}`}</div>
            <div>{`${Math.floor(key[1] / 3600).toString().padStart(2, "0")}:${Math.floor((key[1] % 3600) / 60).toString().padStart(2, "0")}:${(key[1] % 60).toString().padStart(2, "0")}`}</div>
          </ul>
        ))
      } */}
      {
        Object.entries(websiteList).sort(([,a],[,b]) => b-a).map((key) => {
          return (          
          <ul className='flex justify-between px-8 py-4 my-2 bg-red-100'>
            <div>
              {/* <img src={key[0]} alt={`${key[0]} icon`} /> */}
              <p>{`${key[0]}`}</p>
            </div>
            <div>{`${Math.floor(key[1] / 3600).toString().padStart(2, "0")}:${Math.floor((key[1] % 3600) / 60).toString().padStart(2, "0")}:${(key[1] % 60).toString().padStart(2, "0")}`}</div>
          </ul>);
        })};
    </div>
  );
}

export default WebsitesList;