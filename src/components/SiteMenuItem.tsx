
const SiteMenuItem = ({
  icon,
  url,
  time,
  focus,
} : {
  icon: string,
  url: string,
  time: number,
  focus?: boolean
}) => {
  return (
    <li>
      <a href="js/dashboard.html" className={`flex justify-between px-8 py-6 text-sm hover:bg-[#f7f9f9] ${focus && "font-bold rounded-lg"}`}>
        <div className='flex items-center overflow-hidden'>
          <img src={icon} alt={`${url} icon`} className='h-6 w-6 mr-2'/>
          <p >{`${url}`}</p>
        </div>
        <div className='flex items-center ml-2'>{`${Math.floor(time / 3600).toString().padStart(2, "0")}:${Math.floor((time % 3600) / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}</div>
      </a>
    </li>

  )
}

export default SiteMenuItem