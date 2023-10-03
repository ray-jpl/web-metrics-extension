import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Settings from "../components/Settings";
import Sidebar from "../components/Sidebar";
import SiteDashboard from "../components/SiteDashboard";
import UsageDashboard from "../components/UsageDashboard";
import Home from "./Home";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col-reverse lg:flex-row">
      <div className="w-full h-16 lg:w-72 lg:h-full"> 
        <Sidebar/>
      </div>
      
      <main className="bg-[#f8f9fa] block flex-grow">
        <Routes>
          <Route path="/">
            <Route index element={<Home/>}/>
            <Route path="page" element={<SiteDashboard/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="usage" element={<UsageDashboard/>} />
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard