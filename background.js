function syncListener() {
  console.log('syncCallback')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "eventCallback"});  
  });
}

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message.message === "loading_complete") {
      chrome.webRequest.onCompleted.removeListener(syncListener)

      chrome.webRequest.onCompleted.addListener(
        syncListener,
        {urls: ['https://calendar.google.com/calendar/*/sync.sync']}
      )
    }
  })

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'unloaded') {
//     chrome.webRequest.onCompleted.removeListener(syncListener)
//     return
//   }
//   else if (changeInfo.status === 'complete') {
//     chrome.webRequest.onCompleted.addListener(
//       syncListener,
//       {urls: ['https://calendar.google.com/calendar/*/sync.sync']}
//     )
//   }
// })

