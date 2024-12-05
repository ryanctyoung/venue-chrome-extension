let preset_venues = []
let extension_enabled = true

const readSyncStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};

chrome.runtime.sendMessage({'message': 'getCalendarList'})

chrome.storage.sync.get([preset_venue_sync_name, enabled_sync_name]).then((result) => {
  if( result[preset_venue_sync_name] == undefined || (result[preset_venue_sync_name].length === 1 && result[preset_venue_sync_name][0].trim().length === 0)){
    return
  }
  preset_venues = result[preset_venue_sync_name]
  extension_enabled = result[enabled_sync_name] ?? true
})

function collectEventsCallback(mutationList) {
  if (!extension_enabled) {
    return
  }
  
  viewModeElement = document.querySelector(view_mode_selector)

  if(viewModeElement === null) {
    return
  }

  if (viewModeElement.textContent === 'Day') {
    dayModeRender()
  }
  else if (viewModeElement.textContent === 'Week') {
    weekModeRender()
  }
  // else if (viewModeElement.textContent === 'Month') {
  //   monthModeRender()
  // }
}

function eventModalCallback(mutationList) {
  const eventModal = document.querySelector(event_modal_selector)
  if (eventModal != null) {
    eventModalRender(eventModal)
  }
}

function eventEditListener(request, sender, sendResponse) {
  const eventEdit = document.querySelector(event_edit_page_selector)
  if (request.message = 'Venue: Event Edit') {
    console.log("eventEditCallback")
    waitForElm(event_edit_page_selector).then(
      (page) => {
        console.log('Promise fulfilled')
        eventModalRender(page)
      })
    // eventEditPage.then(() => {console.log('Promise fulfilled')})
  }
}

//from observer.js
  addObserverIfDesiredNodeAvailable(observe_selector, collectEventsCallback);
  addObserverIfDesiredNodeAvailable(modal_overlay_selector, eventModalCallback);


console.log('Initializing Calendar Venue...')



// addObserverIfDesiredNodeAvailable(event_edit_selector, eventEditCallback);

chrome.runtime.onMessage.addListener(eventEditListener)
