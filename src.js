
const test_venues = ['Test 1', 'Test 2']
const venue_regex = /(?<=Location: ).[^,]+/
const px_regex = /([^a-z])/
const day_regex = /\/calendar.*\/day/
const event_selector = "div[role=button][data-eventid]"
const observe_selector = "div[class=SGWAac]"
const view_mode_selector = "[jsname='jnPWCc'] > span[jsname='V67aGc'][class='VfPpkd-vQzf8d']"
const column_header_selector = "div[class=Ifvtsc]"
const initial_spacing_selector = "div[class=fimTmc]"
const headerClassName = "venueHeader"
const column_width = 250
const column_margin = 10
const font_size = 26

function dec_to_px(x) {
  return `${x}px`
}

function px_to_dec(x) {
  return x.match(px_regex)
}

function collectEventsCallback(mutationList) {
  console.log('collectEventsCallback')
  viewModeElement = document.querySelector(view_mode_selector)
  // getLocalizedString('day')
  // get calendar mode by reading the dropdown instead: <span jsname="V67aGc"> Day </span>
  if (viewModeElement.textContent !== 'Day') {
    console.log(viewModeElement.textContent)
    return
  }

  // Create Header Flexbox
  const flexbox = document.createElement('div')
  flexbox.style.setProperty('display', 'flex')
  flexbox.style.setProperty('flex-direction', 'row')
  columnHeader = document.querySelector("div[class=Ifvtsc]")
  spacingElement = document.querySelector(initial_spacing_selector)
  initialSpacing =  spacingElement?.offsetWidth
  initialSpacing += spacingElement ? parseInt(getComputedStyle(spacingElement).marginLeft) : 0
  columnHeader?.replaceChildren(flexbox)

  const events = Array.from(document.querySelectorAll(event_selector)).map(event => {
    return {element: event, venue: event.outerText.match(venue_regex)? event.outerText.match(venue_regex)[0] : 'None'}
  })
  const venue_labels = [...new Set(events.map(e => e.venue))].sort()
  if (venue_labels.length > 1 || !(venue_labels.includes('None'))) {
    const venue_headers = venue_labels.map((label) => {
      const header = document.createElement('div')
      header.className = headerClassName
      header.textContent = label
      return header
    })
    flexbox.replaceChildren(...venue_headers)  
  }

  events.map(e => {
    const index = venue_labels.findIndex((label) => e.venue === label) ?? 0
    console.log(index)
    const finalSpacing = initialSpacing + (index*column_width)

    e.element.style.setProperty("width", dec_to_px(column_width - (2*column_margin)), "important")
    e.element.style.setProperty("margin", `0 ${dec_to_px(column_margin)} 0 ${dec_to_px(column_margin)}`, "important")
    e.element.style.setProperty("left", dec_to_px(finalSpacing), "important")
  })
}

//from observer.js
addObserverIfDesiredNodeAvailable(observe_selector);

