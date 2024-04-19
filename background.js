function syncListener() {
  console.log('syncCallback')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "eventCallback"});  
  });
}

/*
  Main listener.Receives update from content script upon render, adds listener for sync.sync web requests
*/
// chrome.runtime.onMessage.addListener(
//   function (message, sender, sendResponse) {
//     if (message.message === "loading_complete") {
//       // chrome.webRequest.onCompleted.removeListener(syncListener)

//       chrome.webRequest.onCompleted.addListener(
//         syncListener,
//         {urls: ['https://calendar.google.com/calendar/*/sync.sync']}
//       )
//     }
//   })
