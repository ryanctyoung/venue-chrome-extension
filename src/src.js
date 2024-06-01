let preset_venues = []


// function dec_to_px(x) {
//   return `${x}px`
// }

// function px_to_dec(x) {
//   return x.match(px_regex)
// }

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

chrome.storage.sync.get([preset_venue_sync_name]).then((result) => {
  console.log(result.default_venues)
  if(result.default_venues.length === 1 && result.default_venues[0].trim().length === 0){
    return
  }
  preset_venues = result.default_venues
})

function collectEventsCallback(mutationList) {
  // console.log('collectEventsCallback')
  viewModeElement = document.querySelector(view_mode_selector)

  // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

  // getLocalizedString('day')
  // get calendar mode by reading the dropdown instead: <span jsname="V67aGc"> Day </span>
  if (viewModeElement.textContent === 'Day') {
    dayModeRender()
  }
  else if (viewModeElement.textContent === 'Week') {
    weekModeRender()
  }
}

function eventModalCallback(mutationList) {
  const eventModal = document.querySelector(event_modal_selector)
  if (eventModal != null) {
    eventModalRender(eventModal)
  }
}



console.log('Initializing Calendar Venue...')


// // listen for potential update from popup
// chrome.runtime.onMessage.addListener(msgObj => {
//   // do something with msgObj
// });

//from observer.js
addObserverIfDesiredNodeAvailable(observe_selector, collectEventsCallback);
addObserverIfDesiredNodeAvailable(modal_overlay_selector, eventModalCallback);

