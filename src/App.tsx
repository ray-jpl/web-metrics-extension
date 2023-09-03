import './App.css';
import PopupHeader from './components/PopupHeader';
import WebsitesList from './components/WebsiteList';


function App() {
  return (
    <div className="w-96 h-96 flex flex-col bg-[#f8f9fa] text-text font-sans">
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <PopupHeader/>
        <WebsitesList/>
    </div>
  );
}

export default App;
