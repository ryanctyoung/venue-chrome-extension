// selector for Google Events in Calendar
// $$("div[role=button][data-eventid]")

const test_venues = ['Test 1', 'Test 2']

USER_INFO = null;
function getUserInfo(cb) {
  if (USER_INFO != null) {
    cb(USER_INFO);
    return;
  }
  chrome.runtime.sendMessage({'type': 'getUserInfo'}, function(userInfo) {
    USER_INFO = userInfo;
    cb(USER_INFO);
  });
}

function collectEventsCallback() {
  const events = document.querySelectorAll("div[role=button][data-eventid]")
  console.log(events)
}

// url for Chrome Listener event documentation: https://developer.chrome.com/docs/extensions/reference/api/webRequest
function init() {
  console.log('init()')
  chrome.runtime.sendMessage({message:'loading_complete'})
  // window.addEventListener('load', () => {
  //   collectEventsCallback()
  // });
  chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if (message.action === "eventCallback") {
        console.log("received message");
        collectEventsCallback()
      }
  });
}

init()