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


function getEventTimes(text) {
  let startString = ''
  let endString = ''
  let startTime = -1
  let endTime = -1

  let stringToMinutes = (s) => {
    let minutes = s.includes('pm') ? minutes_in_half_day : 0
    const parts = s.split(':')
    minutes +=   parseInt(parts[0]) === 12 ? 0 : parseInt(parts[0]) * minutes_in_hour
    if (parts.length > 1) {
      minutes += parseInt(parts[1])
    }
    return Math.min(minutes, minutes_in_day - 1)
  }

  if (text.includes(',')) {
    startString = text.split(',')[0]
    startTime = stringToMinutes(startString)
    endTime = startTime + minutes_in_hour
  }
  else {
    const times = text.split("–")
    startString = times[0]
    endString = times.length > 1 ? times[1] : ''
    startTime = stringToMinutes(startString)
    endTime = stringToMinutes(endString)

    if (endTime > minutes_in_half_day && !startString.includes('am')) {
      startTime += minutes_in_half_day
    }
  }

  return {startTime, endTime}
}

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

