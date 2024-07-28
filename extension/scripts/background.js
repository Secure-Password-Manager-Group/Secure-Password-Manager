chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: 'OFF'
    });
  });
  
  const extensions = 'https://developer.chrome.com/docs/extensions';
  const webstore = 'https://developer.chrome.com/docs/webstore';
  
  // When the user clicks on the extension action
  chrome.action.onClicked.addListener(async (tab) => {
    let url = chrome.runtime.getUrl('index_ext.html')      
    }
);