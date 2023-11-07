![web metrics logo](https://github.com/ray-jpl/web-metrics-extension/blob/master/src/assets/logo_icon%40128w.png)
# Web Metrics - Chrome extension to track time spent browsing
![promo1](https://github.com/ray-jpl/web-metrics-extension/blob/master/slideshow/popup.png)
![promo2](https://github.com/ray-jpl/web-metrics-extension/blob/master/slideshow/dashboardHome%401280.png)
![promo3](https://github.com/ray-jpl/web-metrics-extension/blob/master/slideshow/dashboardUsage%401280.png)

## Installation
### Chrome Web Store
[Install it from the Chrome Web Store!](https://chrome.google.com/webstore/detail/web-metrics/opfdolkbjbijbebmchpapkgodklemiae)

### Run Locally
1. In terminal run `npm install` to install dependencies
2. Run `npm run build` to create build. It should output to a `dist` directory
3. In Chrome go to the extensions page (`chrome://extensions`)
4. Enable Developer Mode at the top right
5. Click on `Load Unpacked` and select the `dist` folder
6. Extension should start running 


## How to use
The extension should automatically start tracking the usage time on installation. It will only track website urls starting with http/https.
Clicking on the extension on the top right of the menu should show a popup window which contains the following information
- Currently tracked webpage
- Top 15 websites by time usage
- Home button and Logo redirect to the extensions built-in homepage
Clicking on any of the webpages in the popup will redirect you to more information about that webpage.


The homepage shows the complete list of tracked webpages for the day. Clicking on these will also bring you to the information about that page. In this page you can see the current time spent and also set a time limit on how much time you want to spend.

The sidebar also has navigation to the Usage Limits page which shows a list of all usage time limits applied for each site in case you lose track.
