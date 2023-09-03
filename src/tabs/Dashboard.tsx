import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Home from "./Home";

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col-reverse lg:flex-row">
      <div className="w-full h-16 lg:w-72 lg:h-full"> 
        <Sidebar/>
      </div>
      
      <main className="bg-[#f8f9fa] block flex-grow">
        <Routes>
          <Route path="/js/dashboard.html" element={<Home/>}> 
            <Route path="page" element={<div>NEW PAGE</div>} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default Dashboard