var month_day_stamp_regex

(async () => {
  const src = chrome.runtime.getURL("src/vars/regex.js");
  ({month_day_stamp_regex} = await import(src));

})();

const columnMargins = week_view_day_header_column_margins // px

function weekModeRender() {

  const numberOfColumns = preset_venues.length + 1
  var columnWidth = 0
  const events = Array.from(document.querySelectorAll(event_selector)).map(event => {
    const eventDetailsText = event.querySelector(week_view_event_details_selector)?.textContent
    const eventVenue = eventDetailsText.match(venue_regex)?.[0] ?? empty_venue_placeholder
    const timeStamp = eventDetailsText.match(timestamp_regex)?.[0] ?? ''
    const dateStamp = eventDetailsText.match(month_day_stamp_regex)?.[0] ?? ''


    return {
      element: event,
      venue: eventVenue,
      timeStamp,
      date: dateStamp
    }
  })

  // install venue columns into each day on the week view
  // day : HTMLElement
  function createDayColumn(day) {
    
    let columnContainer = day.querySelector(`div[class=${day_header_container_classname}]`)
    if (columnContainer === null) {
      columnContainer = document.createElement("div")
      day?.appendChild(columnContainer)

      columnContainer.className = day_header_container_classname
      columnContainer.style.setProperty('display', 'flex')
      columnContainer.style.setProperty('flex-direction', 'row')
      columnContainer.style.setProperty('justify-content', 'flex-start')
  
      
      for (let i = 0; i < numberOfColumns - 1; i++) {
        const venueName = preset_venues[i]
  
        const columnDiv = document.createElement("div")
        columnDiv.className = day_header_classname
        columnDiv.style.setProperty('width', `calc(${100 / numberOfColumns}% - ${2 * columnMargins}px)`)
        columnDiv.style.setProperty('height', '10px')
        columnDiv.style.setProperty('background-color', 'blue')
        columnDiv.style.setProperty('border-radius', '3px')
        columnDiv.style.setProperty('margin', `0px ${columnMargins}px 0px ${columnMargins}px`)
        columnContainer?.appendChild(columnDiv)
  
        // apply on hover tooltip
        const venueToolTopDiv = document.createElement("div")
        venueToolTopDiv.className = day_header_tooltip_classname
        venueToolTopDiv.textContent = venueName
        columnDiv?.appendChild(venueToolTopDiv)
      }
      day?.appendChild(columnContainer)
    }
    columnWidth = (columnContainer.getBoundingClientRect().width / numberOfColumns) - (2 *columnMargins)

  }
  const dayColumns = Array.from(document.querySelectorAll(day_column_selector))
  dayColumns.map(createDayColumn)

  // instantiating the multi-event containers for each day
  Array.from(document.querySelectorAll(week_view_day_gridcell_selector)).map(day => {
    let multi_event_container = day.querySelector(week_view_multi_event_container_selector)
    if (multi_event_container === null) {
      multi_event_container = document.createElement("div")
      const index = day.getAttribute("data-column-index")
      multi_event_container.setAttribute("class", week_view_multi_event_container_class)
      multi_event_container.setAttribute("venue-index", index)
      day.querySelector(week_view_day_timeline_selector)?.appendChild(multi_event_container)
    }
    multi_event_container.replaceChildren()
  })

  const presetVenueSpacingMap = ((arr) => {
    const obj = {}
    for (var key in Object.keys(arr)) {
      obj[arr[key]] = key
    }
    return obj
  })(preset_venues)



  // add tooltip with Title, Location, Timestamp.
  // singleton tooltip that moves to each event 
  const toolTip = new EventToolTip(document.querySelector(`div[class=${week_view_event_tooltip_classname}]`) ?? document.createElement("div"))
  const toolTipDiv = toolTip.html
  toolTipDiv.className = week_view_event_tooltip_classname
  const weekBoard = document.querySelector(week_view_event_board_selector)
  weekBoard.appendChild(toolTipDiv)
  



  // organize events into their respective venues
  // event : HTMLElement
  function createMultiEvents(e) {
    const eventHTML = e.element
    const location = eventHTML.querySelector(week_view_event_location_selector)?.textContent ?? ""
    const title = eventHTML.querySelector(week_view_event_title_selector)?.textContent ?? "(No Title)"
    // const timeStamp = eventHTML.querySelector(week_view_event_timestamp_selector)?.textContent ?? ""
    // const eventDimensions = eventHTML.getBoundingClientRect()

    const multi_event_container = eventHTML.closest(week_view_day_gridcell_selector)?.querySelector(week_view_multi_event_container_selector)
    
    const venues = location.split(";").map(v => {
      v = v.trim()
      const result = preset_venues.includes(v) ? v: empty_venue_placeholder
      return result
    })

    
    // create clone event elements for multi-venue events
    for(let i = 0; i < venues.length ; i++) {
      const index = preset_venues.findIndex((label) => venues[i] === label) ?? 0
      const eventSpacing = presetVenueSpacingMap[venues[i]] ?? preset_venues.length
      let eventWidth = columnWidth

      let htmlBox = null
      if (i === 0) { // this is the original event element
        htmlBox = eventHTML
      } else { // create multi-event clone
        htmlBox = document.createElement("div")
        htmlBox.className = week_view_multi_event_class
        const titleDiv = document.createElement("div")
        titleDiv.textContent = title
        titleDiv.className = week_view_multi_event_title_class
        titleDiv.style.setProperty("visibility", week_view_event_detail_visibility)

        const venueDiv = document.createElement("div")
        venueDiv.textContent = location
        venueDiv.className = week_view_multi_event_venue_class
        venueDiv.style.setProperty("visibility", week_view_event_detail_visibility)

        htmlBox.style.setProperty("top", eventHTML.style.top)
        htmlBox.style.setProperty("height", eventHTML.style.height)


        htmlBox.style.backgroundColor = eventHTML.style.backgroundColor
        htmlBox.style.cursor = multi_event_pointer
        htmlBox.style.setProperty("position", multi_event_position_style)

        htmlBox.onclick = (clickevent) => {
          clickevent.stopPropagation()
          eventHTML.click()
        }

        htmlBox.append(titleDiv, venueDiv)
        multi_event_container?.appendChild(htmlBox)
      }


      // Event Highlighting on Mouse Over
      const defaultBorder = `${dec_to_px(week_event_border_size)} solid black`
      htmlBox.onmousemove = (e) => {
        const targetRect = e.target.getBoundingClientRect()
        const boardRect = weekBoard.getBoundingClientRect()
        toolTip.clear()
        // toolTipDiv.textContent = `${title} @ ${location}`
        htmlBox.style.border = `${dec_to_px(week_event_border_size_highlighted)} solid black`
        toolTipDiv.style.visibility = 'visible'
        toolTipDiv.style.left = targetRect.left - boardRect.left + 20 +  "px"
        toolTipDiv.style.top = targetRect.top - boardRect.top + "px"


        // acquire all events at cursor regardless of z-index
        const elements = document.elementsFromPoint(e.clientX, e.clientY).filter(element => element.matches(event_selector) || element.matches(week_view_multi_event_selector));
        for (const element of elements) {
          const elementTitle = element.querySelector(week_view_event_title_selector)?.textContent ?? (element.querySelector(`div[class=${week_view_multi_event_title_class}]`)?.textContent ?? "(No Title)")
          const elementvenue = element.querySelector(week_view_event_location_selector)?.textContent ?? (element.querySelector(`div[class=${week_view_multi_event_venue_class}]`)?.textContent ?? "Other")

          toolTip.add(elementTitle, elementvenue)
        }        
      }

      htmlBox.onmouseleave = () => {
        htmlBox.style.border = defaultBorder
        toolTipDiv.style.visibility = 'hidden'
        toolTip.clear()
      }

      // apply universal styling
      htmlBox.querySelector(event_details_selector)?.style.setProperty("visibility", week_view_event_detail_visibility)
      htmlBox.style.setProperty("width", dec_to_px(eventWidth), "important")
      htmlBox.style.border = defaultBorder
      htmlBox.style.setProperty("margin", `0px ${dec_to_px(columnMargins)}`, "important")
      htmlBox.style.setProperty("left", dec_to_px((columnWidth + (2 *columnMargins)) * eventSpacing), "important")
      htmlBox.style.borderRadius = `${dec_to_px(week_event_border_radius)}`
      htmlBox.style.opacity = week_event_opacity
      // htmlBox.style.zIndex = 10
    }
  }
  events.map(createMultiEvents)
  const currentEvents = {}
  events.map((e) => {
    if (!e.element.hasAttribute(event_placeholder_attribute)) {
      return
    }

    if (!(e.date in currentEvents)) {
      currentEvents[e.date] = {}
    }
    
    let venues = parseVenuesFromString(e.venue)
    venues.map(v => {
      if (!([v] in currentEvents[e.date])) {
        currentEvents[e.date][v] = []      
      }
      currentEvents[e.date][v].push(e.timeStamp)
    })
  })

  chrome.storage.sync.set({[current_event_list_sync_name]: currentEvents})
}