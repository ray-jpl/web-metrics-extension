import { Link, useLocation } from "react-router-dom";
import BarChartSqIcon from "./icons/BarChartSqIcon";
import HomeIcon from "./icons/HomeIcon";

const routes = [
  {
    label: "Home",
    icon: HomeIcon,
    href: "/"
  },
  {
    label: "Usage Limits",
    icon: BarChartSqIcon,
    href: "/usage"
  }
]


const Sidebar = () => {
  let location = useLocation();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full border-r-2 border-zinc-200">
      <div className='px-3 py-2 flex-1'>
        <Link to="/dashboard.html" className='flex items-center pl-3 mb-14'>
          <div className="relative h-8 w-8 mr-4">
            <img
              src="../logo_icon@96w.png"
              alt="logo"
            />
          </div>
          <h1 className="text-accent text-2xl font-bold tracking-tight">Web Metrics</h1>
        </Link>
        <div className='space-y-1'>
          {routes.map((route) => (
            <Link 
              to={route.href}
              key={route.href}
              className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-zinc-500 hover:bg-zinc-500/10 rounded-lg transition ${location.pathname === route.href ? "text-zinc-500 bg-zinc-500/10" : "text-black"}`}
            >
              <div className="flex items-center">
                <route.icon className="h-5 w-5 mr-3"/>
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar