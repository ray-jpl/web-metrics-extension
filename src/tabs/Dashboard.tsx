
const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-col-reverse  lg:flex-row">
      <div className="w-full h-16 bg-red-100 lg:w-72 lg:h-full"> SIDEBAR</div>
      <div className="bg-green-100 flex-grow"> MAIN CONTENT</div>
    </div>
  )
}

export default Dashboard