
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
    <ul className={`flex justify-between px-8 py-4 my-2 text-sm ${focus && "font-bold border-y-2 border-s-slate-200"}`}>
      <div className='flex items-center overflow-hidden'>
        <img src={icon} alt={`${url} icon`} className='h-6 w-6 mr-2'/>
        <p >{`${url}`}</p>
      </div>
      <div className='flex items-center ml-2'>{`${Math.floor(time / 3600).toString().padStart(2, "0")}:${Math.floor((time % 3600) / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`}</div>
    </ul>
  )
}

export default SiteMenuItem