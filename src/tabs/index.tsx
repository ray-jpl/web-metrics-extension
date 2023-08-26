import ReactDOM from 'react-dom/client';
import '../App.css';
import WebsitesList from '../components/WebsiteList';

const newTab = (
  <div>
    <p>This is a new tab</p>
    <WebsitesList/>
  </div>
)

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(newTab);
