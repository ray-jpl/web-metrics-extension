import HomeIcon from "./icons/HomeIcon";

const PopupHeader = () => {
  return (
    <div className="flex justify-between items-center p-2 border-b-2 border-zinc-200 bg-white">
      <h1 className='text-accent font-bold text-lg tracking-tighter'>Web Metrics</h1>
      <div>
        <button 
          onClick={() => {
            chrome.tabs.create({
              url: "dashboard.html"
            }); 
          }}
          className="rounded-full p-1 hover:bg-zinc-200"
        >
          <HomeIcon/>
        </button>
      </div>
    </div>
  )
}

export default PopupHeader