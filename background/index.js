import { event_edit_regex } from '../src/vars/regex.js'

var secrets = fetch('/secrets.json').then((res) => res.json());

// getCalendarList call to popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  secrets = await secrets
  if (request.message = 'getCalendarList') {
    
    chrome.identity.getAuthToken({interactive: true}, (token) => {
      let parameters = {
        method: 'GET',
        async: true,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        'contentType': 'json'
      };

      fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${secrets.API_key}`, parameters)
        .then((res) => {
          if (res.status !== 200) {
            const error = new Error("Calendar GET HTTP error")
            error.statusCode = res.status
            console.log(res)
            throw error
          } else {
            return res.json()
          }
        })
        .then((data => {
          //no changes since last get call
          if (data === undefined) {
            console.log('No new calendar updates')
            return
          }
          const pick = (obj, arr) =>
            Object.fromEntries(Object.entries(obj).filter(([k]) => arr.includes(k)));
          
          const calendars = data.items.map(c => pick(c, ['id', 'summary', 'description']))
          chrome.storage.sync.set({calendars: calendars}).then(() => {
            console.log("Default venues saved")
          })
      })
      )
        .catch((err) => console.error(err));
    })
  } 
});

function sendEventEditMessage(url, tabId) {
  if (url != undefined && tabId != undefined && url.match(event_edit_regex)) {
    chrome.tabs.sendMessage( tabId, {
      message: 'Venue: Event Edit',
      url: url
    })
  }
}

// url navigation listener for Event Edit
chrome.webNavigation.onCompleted.addListener(
  function(object) {
    console.log(object)
    const {url, tabId} = object
    sendEventEditMessage(url, tabId)
  }
)

// url change listener for Event Edit
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    console.log(changeInfo)
    sendEventEditMessage(changeInfo.url, tabId)
  })