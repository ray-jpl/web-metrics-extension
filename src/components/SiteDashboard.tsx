import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CURRENT_DATA, USAGE_LIMIT } from "../constants";
import { SiteInfo, UsageLimit } from "../types";
import BarChartSqIcon from "./icons/BarChartSqIcon";

const SiteDashboard = () => {
  const [searchParams] = useSearchParams();
  const [siteInfo, setSiteInfo] = useState<SiteInfo>();
  const [isUsageVisible, setIsUsageVisible] = useState<boolean>(false);
  const [curUsageLimit, setCurUsageLimit] = useState<number>(0);
  const [usageHours, setUsageHours] = useState<number>(0);
  const [usageMins, setUsageMins] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const url = searchParams.get("url") || "";
    getUsageLimit();
    const interval = setInterval(() => {
      chrome.storage.local.get(CURRENT_DATA, (data) => {
        setSiteInfo(data.currentData[url]);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []); 

  if (searchParams.get("url") == null) {
    // Redirect to 404?
    navigate({
      pathname: '/*'
    });
  }

  function getUsageLimit() {
    const url = searchParams.get("url");
    chrome.storage.local.get(USAGE_LIMIT, (data) => {
      if (url != null && data != null) {
        setIsUsageVisible(true);
        setCurUsageLimit(data[USAGE_LIMIT][url] ? data[USAGE_LIMIT][url].time : 0);
      }
    })
  }

  function updateUsageLimit() {
    let usageInSeconds = usageHours * 3600 + usageMins * 60
    let usageLimit: UsageLimit = {
      time: usageInSeconds 
    };

    chrome.storage.local.get(USAGE_LIMIT, (result) => {
      let url = searchParams.get("url");
      let websiteDataList: { [url: string]: UsageLimit } = {};
      if (result != null && result[USAGE_LIMIT] != null) {
        websiteDataList = result[USAGE_LIMIT];
      }
      
      if (url != null) {
        websiteDataList[url] = usageLimit;
        chrome.storage.local.set({ [USAGE_LIMIT]: websiteDataList });
        getUsageLimit()
      }
    });
  }

  function deleteUsageLimit() {
    chrome.storage.local.get(USAGE_LIMIT, (result) => {
      let url = searchParams.get("url");
      let websiteDataList: { [url: string]: UsageLimit } = {};
      if (result != null && result[USAGE_LIMIT] != null) {
        websiteDataList = result[USAGE_LIMIT];
      }
      
      
      if (url != null) {
        delete websiteDataList[url];
        chrome.storage.local.set({ [USAGE_LIMIT]: websiteDataList });
        getUsageLimit()
      }
    });
  }

  return (
    <div>
      <div className="flex justify-start mt-5 mb-5 relative top-0 w-full px-4 md:mt-8 md:px-10">
        <div className="relative h-8 w-8 mr-2">
          <img
            src={siteInfo ? siteInfo.icon : "./document.svg"}
            alt="logo"
            className="w-full h-full"
          />
        </div>
        <h1 className="text-xl font-semibold">{searchParams.get("url")}</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-full px-8 lg:w-[960px] lg:px-2 ">
          <div className="flex flex-col">

            <div className="flex justify-center mb-5">
              <div className="text-3xl bg-white py-2 px-4 rounded-lg border-2 border-zinc-200">{formatTimeString(siteInfo ? siteInfo.time : 0)}</div>
            </div>
            
            <div className="flex">
              <BarChartSqIcon className="h-6 w-6 mr-1"/>
              <h2 className="text-lg">Usage Limit</h2>
            </div>
            <div className="flex justify-center mb-2">
              <div className="text-3xl bg-white py-2 px-4 rounded-lg border-2 border-zinc-200">{formatTimeString(curUsageLimit)}</div>
            </div>
            <div className="flex justify-center">
              <div className="flex">
                <div className="flex flex-col px-2 text-xl w-24">
                  <label htmlFor="hours" className="font-semibold py-1">Hours</label>
                  <input 
                    type="number" 
                    name="hours" 
                    value={usageHours}
                    className="text-center"
                    onChange={(e) => {
                      let value = Number(e.target.value.replace(/[^\d]/,''));
                      if (value < 0) {
                        value = 0;
                      } else if (value > 23) {
                        value = 23
                      }
                      setUsageHours(value);
                    }}
                  />
                </div>
                <div className="flex flex-col px-2 text-xl w-24">
                  <label htmlFor="mins" className="font-semibold py-1">Minutes</label>
                  <input 
                    type="number" 
                    name="mins" 
                    value={usageMins}
                    className="text-center"
                    onChange={(e) => {
                      let value = Number(e.target.value.replace(/[^\d]/,''));
                      if (value < 0) {
                        value = 0;
                      } else if (value > 59) {
                        value = 59
                      }
                      setUsageMins(value);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-end px-2">
                <button 
                  onClick={() => {updateUsageLimit()}}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 hover:bg-zinc-900/90 text-white h-8 px-4 py-2">
                  Save
                </button>
              </div>
              <div className="flex items-end px-2">
                <button 
                  onClick={() => {deleteUsageLimit()}}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 hover:bg-red-500/90 text-white h-8 px-4 py-2">
                  Delete
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTimeString(time: number) {
  return `${Math.floor(time / 3600).toString().padStart(2, "0")}:${Math.floor((time % 3600) / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
}

export default SiteDashboard