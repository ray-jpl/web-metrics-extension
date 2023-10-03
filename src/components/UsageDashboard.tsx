import { useEffect, useState } from 'react';
import SiteMenuItem from "../components/SiteMenuItem";
import { CURRENT_DATA, USAGE_LIMIT } from '../constants';
import { SiteInfo, UsageLimit } from '../types';

interface WebsiteData {
  [key: string]: SiteInfo
}

const UsageDashboard = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteData>({});
  const [usageList, setUsageList] = useState<{[key:string]: UsageLimit}>({});
  
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
  

  function loadData() {
    chrome.storage.local.get(CURRENT_DATA, (data) => {
      if (data[CURRENT_DATA]) {
        setWebsiteList(data[CURRENT_DATA]);
      } else {
        setWebsiteList({});
      }
    });
    chrome.storage.local.get(USAGE_LIMIT, (data) => {
      if (data && data[USAGE_LIMIT]) {
        setUsageList(data[USAGE_LIMIT]);
      }
    })
  };

  return (
    <div className='h-full flex flex-col items-center overflow-y-scroll'>
      <div className="flex justify-start mt-5 relative top-0 w-full md:mt-8 md:px-10">
        <h1 className="text-xl font-semibold">Usage Limits</h1>
      </div>
      
      <div className="w-1/2 my-5 h-2/3">
        <ul className="h-full overflow-y-scroll bg-white rounded-lg border-2 border-zinc-200 my-4">
          {Object.entries(usageList).length == 0 
            ? <div className='h-full flex justify-center items-center font-bold text-xl'>
                <p>No websites visited yet!</p>
              </div> 
            : Object.entries(usageList).sort(([,a],[,b]) => b.time-a.time).map((key) => {
                return (<SiteMenuItem icon={websiteList[key[0]].icon} url={key[0]} time={key[1].time}/>)
              })
          }
          
        </ul>
      </div>


    </div>
  )
}

export default UsageDashboard