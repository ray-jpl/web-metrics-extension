import React from 'react';
import './App.css';
import WebsitesList from './components/WebsiteList';


function App() {
  return (
    <>
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      <div className="text-center w-96 bg-background text-text font-sans">
        <h1 className='text-accent font-bold text-lg tracking-tighter'>Web Metrics</h1>
        <WebsitesList/>
      </div>
    </>
  );
}

export default App;
