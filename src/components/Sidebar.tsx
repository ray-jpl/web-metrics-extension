import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full border-r-2 border-zinc-200">
      <div className='px-3 py-2 flex-1'>
        <Link to="/js/dashboard.html" className='flex items-center pl-3 mb-14'>
          <div className="relative h-8 w-8 mr-4">
            <img
              src="../icon.png"
              alt="logo"
            />
          </div>
          <h1 className="text-2xl font-bold">Web Metrics</h1>
        </Link>
        <div className='space-y-1'>
          <ul>
            <li>
              <Link to="/js/dashboard.html">Home</Link>
            </li>
            <li>
              <Link to="page" relative="path">Books</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar