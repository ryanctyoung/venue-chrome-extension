
const test_venues = ['Test 1', 'Test 2']
const venue_regex = /(?<=Location: ).[^,]+/
const px_regex = /([^a-z])/
const day_regex = /\/calendar.*\/day/
const event_selector = "div[role=button][data-eventid]"
const observe_selector = "div[class=SGWAac]"
const view_mode_selector = "[jsname='jnPWCc'] > span[jsname='V67aGc'][class='VfPpkd-vQzf8d']"
const column_header_selector = "div[class='Ifvtsc']"
const initial_spacing_selector = "div[class='fimTmc']"
const event_grid_selector = "div[class='Tmdkcc elYzab-cXXICe-Hjleke']"
const headerClassName = "venueHeader"
const max_column_width = 250
const column_margin = 5
const overlap_spacing = 5
const font_size = 26
const minutes_in_hour = 60
const minutes_in_half_day = 12 * minutes_in_hour
const minutes_in_day = minutes_in_half_day * 2
const preset_venues = []

function dec_to_px(x) {
  return `${x}px`
}

function px_to_dec(x) {
  return x.match(px_regex)
}

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
  // getLocalizedString('day')
  // get calendar mode by reading the dropdown instead: <span jsname="V67aGc"> Day </span>
  if (viewModeElement.textContent !== 'Day') {
    // console.log(viewModeElement.textContent)
    return
  }

  // Create Header Flexbox
  const flexbox = document.createElement('div')
  flexbox.style.setProperty('display', 'flex')
  flexbox.style.setProperty('flex-direction', 'row')
  // flexbox.style.setProperty('overflow', 'scroll')
  flexbox.style.setProperty('width', 'fit-content')
  const columnHeader = document.querySelector("div[class=Ifvtsc]")
  const eventGrid = document.querySelector(event_grid_selector)
  const spacingElement = document.querySelector(initial_spacing_selector)
  let initialSpacing =  spacingElement?.offsetWidth
  initialSpacing += spacingElement ? parseInt(getComputedStyle(spacingElement).marginLeft) : 0
  columnHeader?.style.setProperty('width', '100%')
  columnHeader?.style.setProperty('overflow-x', 'hidden')
  columnHeader?.replaceChildren(flexbox)

  // form - {element: HTMLElement, venue: string}
  const events = Array.from(document.querySelectorAll(event_selector)).map(event => {
    return {element: event, venue: event.outerText.match(venue_regex)? event.outerText.match(venue_regex)[0] : 'None'}
  })
  const venue_labels = [...new Set(preset_venues.concat(events.map(e => e.venue)))].sort()
  if (venue_labels.length > 1 || !(venue_labels.includes('None'))) {
    const venue_headers = venue_labels.map((label) => {
      const header = document.createElement('div')
      header.className = headerClassName
      header.textContent = label
      return header
    })
    flexbox.replaceChildren(...venue_headers)  
  }

  eventGrid?.style.setProperty('width', dec_to_px(flexbox.offsetWidth + initialSpacing + (2*column_margin)))
  eventGrid?.parentElement.addEventListener("scroll", (e) => {
    console.log(e.target.scrollLeft)
    columnHeader.scrollLeft = e.target.scrollLeft
  })

  // form - {start, end, stack}
  const overlapMapper = venue_labels.reduce((acc, curr) => (acc[curr] = [], acc) , {})

  events.map(e => {
    const eventTimeStamp = e.element.querySelector("div[class*='lhydbb gVNoLb  EiZ8Dd'], div[class='b0NTye']")?.textContent
    
    // form - {startTime, endTime}
    timeStamp = getEventTimes(eventTimeStamp)
    // console.log(overlapMapper)
    if (overlapMapper[e.venue].length === 0) {
      overlapMapper[e.venue].push(timeStamp)
    } else {
      
      while(overlapMapper[e.venue].length > 0) {
        const topLayer = overlapMapper[e.venue].slice(-1)
        if (timeStamp.startTime < topLayer.endTime) {
          overlapMapper[e.venue].push(timeStamp)
          break
        } else {
          overlapMapper[e.venue].pop()
        }
      }

    }

    const index = venue_labels.findIndex((label) => e.venue === label) ?? 0
    const finalSpacing = initialSpacing + (index*max_column_width)

    e.element.style.setProperty("width", dec_to_px(max_column_width - (2*column_margin) - ((overlapMapper[e.venue].length-1)*overlap_spacing)), "important")
    e.element.style.setProperty("margin", `0 ${dec_to_px(column_margin)} 0 ${dec_to_px(column_margin)}`, "important")
    e.element.style.setProperty("left", dec_to_px(finalSpacing + ((overlapMapper[e.venue].length-1)*overlap_spacing)), "important")
  })
}

console.log('Initializing Calendar Venue...')
chrome.storage.sync.get(["default_venues"]).then((result) => {
  preset_venues.push(...result.default_venues)
  console.log(preset_venues)
})

// // listen for potential update from popup
// chrome.runtime.onMessage.addListener(msgObj => {
//   // do something with msgObj
// });

//from observer.js
addObserverIfDesiredNodeAvailable(observe_selector);
