import { useEffect, useState } from 'react';
import SiteMenuItem from "../components/SiteMenuItem";
import { SiteInfo } from '../types';

interface WebsiteData {
  [key: string]: SiteInfo
}

const Home = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteData>({});
  const port = chrome.runtime.connect({ name: "popup" });
  
  // Initial Load
  useEffect(() => {
    loadData();
  },[])
  
  useEffect(() => {
    window.addEventListener("focus", loadData);
    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);
  
  // When React refreshes the popup just adds a new listener, taking more CPU
  // Hence we need to check if listeners already exist
  if (!chrome.runtime.onMessage.hasListeners()) {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
      setWebsiteList(websiteList => ({
        ...websiteList,
        [message.url]: message.data,
      }))
    });
  }

  function loadData() {
    chrome.storage.local.get("currentData", function (data) {
      console.log("LOADING")
      if (data.currentData) {
        setWebsiteList(data.currentData);
      } else {
        setWebsiteList({});
      }
    });
  };

  return (
    <div className='h-full flex flex-col items-center overflow-y-scroll'>
      <div className="flex justify-start mt-5 relative top-0 w-full md:px-10">
        <h1 className="text-xl font-semibold">Home</h1>
      </div>
      
      <div className="w-1/2 my-5 h-2/3">
        <ul className="h-full overflow-y-scroll bg-white rounded-lg border-2 border-zinc-200 my-4">
          {Object.entries(websiteList).sort(([,a],[,b]) => b.time-a.time).map((key) => {
            return (<SiteMenuItem icon={key[1].icon} url={key[0]} time={key[1].time}/>)
          })}
        </ul>
      </div>


    </div>
  )
}

export default Home