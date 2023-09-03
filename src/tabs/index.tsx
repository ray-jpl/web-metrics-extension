import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import '../App.css';
import Dashboard from './Dashboard';

const root = document.createElement("div")
root.className = "w-full h-full"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(  
  <React.StrictMode>
    <BrowserRouter>
      <Dashboard/>
    </BrowserRouter>
  </React.StrictMode>
);
