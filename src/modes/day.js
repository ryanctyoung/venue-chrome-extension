function dayModeRender() {
  let venue_labels = []

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
  columnHeader?.style.setProperty("word-wrap", "break-word")
  columnHeader?.replaceChildren(flexbox)

  // form - {element: HTMLElement, venue: string}
  const events = Array.from(document.querySelectorAll(event_selector)).map(event => {
    return {element: event, venue: event.outerText.match(venue_regex)? event.outerText.match(venue_regex)[0] : empty_venue_placeholder}
  })
  venue_labels = [...new Set(preset_venues.concat(events.map(e => e.venue).sort((a,b) => a < b ? (a === empty_venue_placeholder ? 1 : -1) : 1)))]
  if (venue_labels.length > 1 || !(venue_labels.includes(empty_venue_placeholder))) {
    const venue_headers = venue_labels.map((label) => {
      const header = document.createElement('div')
      header.style.width = dec_to_px(max_column_width - (columnMargins*2))
      header.style.marginLeft = dec_to_px(columnMargins)
      header.style.marginRight = dec_to_px(columnMargins)
      header.className = headerClassName
      header.textContent = label
      return header
    })
    flexbox.replaceChildren(...venue_headers)  
  }

  eventGrid?.style.setProperty('width', dec_to_px(flexbox.offsetWidth + initialSpacing + (2*column_margin)))
  if (columnHeader != null) {
    columnHeader.scrollLeft = eventGrid?.parentElement.scrollLeft
    eventGrid?.parentElement.addEventListener("scroll", (e) => {
      columnHeader.scrollLeft = e.target.scrollLeft
    })
  }


  // form - {start, end, stack}
  const overlapMapper = venue_labels.reduce((acc, curr) => (acc[curr] = [], acc) , {})

  events.map(e => {
    const eventTimeStamp = e.element.querySelector(event_timestamp_selector)?.textContent
    
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